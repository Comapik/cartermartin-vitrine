<?php
/**
 * Carter & Martin — envoi du formulaire de contact par e-mail.
 *
 * Reçoit le POST de contact.html / en/contact.html et envoie le message à MAIL_TO.
 *  - Appel en JavaScript (fetch, en-tête « Accept: application/json ») : réponse JSON {ok, code}.
 *  - Sans JavaScript : redirection vers la page contact avec ?statut=ok|erreur|invalid|throttle.
 *
 * Compatible PHP 7.4+. Utilise la fonction mail() de l'hébergeur.
 */

declare(strict_types=1);

/* ── Configuration ─────────────────────────────────────── */

// Destinataire des messages
const MAIL_TO = 'studio@carter-martin.fr';

// Expéditeur technique : utilisez une adresse DU DOMAINE qui héberge le site,
// sinon les messages risquent d'être classés en spam (SPF / DMARC).
// L'adresse du visiteur est placée en « Reply-To » : il suffit de cliquer sur « Répondre ».
const MAIL_FROM      = 'no-reply@carter-martin.fr';
const MAIL_FROM_NAME = 'Site Carter & Martin';

// Passe l'expéditeur à sendmail (-f). Mettre à false si l'hébergeur refuse ce paramètre.
const USE_ENVELOPE_SENDER = true;

// Délai minimum (en secondes) entre deux envois depuis le même navigateur
const MIN_DELAY_SECONDS = 20;

// Doit correspondre aux valeurs des <option> du formulaire (generateur/data.js → SUBJECT_KEYS)
const SUBJECTS = [
    'oeuvre'     => "Demande au sujet d'une œuvre",
    'commission' => 'Commission / série sur mesure',
    'pret'       => "Prêt d'œuvre & exposition",
    'presse'     => 'Presse',
    'autre'      => 'Autre',
];

const MAX_NAME    = 120;
const MAX_EMAIL   = 254;
const MAX_MESSAGE = 5000;

/* ── Fonctions ─────────────────────────────────────────── */

function wants_json(): bool
{
    return isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
}

/** Termine la requête : JSON pour fetch(), redirection sinon. */
function respond(bool $ok, string $code, string $lang): void
{
    if (wants_json()) {
        $status = [
            'ok'       => 200,
            'invalid'  => 422,
            'throttle' => 429,
            'method'   => 405,
            'server'   => 500,
        ][$code] ?? 400;
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(['ok' => $ok, 'code' => $code]);
        exit;
    }

    $page  = $lang === 'en' ? 'en/contact.html' : 'contact.html';
    $param = $lang === 'en' ? 'status' : 'statut';
    $value = $ok ? 'ok' : (in_array($code, ['invalid', 'throttle'], true) ? $code : ($lang === 'en' ? 'error' : 'erreur'));
    header('Location: ' . $page . '?' . $param . '=' . $value . '#formulaire', true, 303);
    exit;
}

/** Récupère un champ texte du POST (chaîne UTF-8 valide, sans espaces superflus). */
function post_field(string $key): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    // Rejette les chaînes qui ne sont pas de l'UTF-8 valide
    return preg_match('//u', $value) === 1 ? $value : '';
}

/** Longueur en caractères (sans dépendre de mbstring). */
function char_length(string $value): int
{
    return (int) preg_match_all('/./us', $value);
}

/** Supprime les retours à la ligne et caractères de contrôle (anti-injection d'en-têtes). */
function single_line(string $value): string
{
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value));
}

/** Encode un texte pour un en-tête d'e-mail (RFC 2047). */
function encode_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/* ── Traitement ────────────────────────────────────────── */

$lang = (isset($_POST['lang']) && $_POST['lang'] === 'en') ? 'en' : 'fr';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    if (wants_json()) {
        header('Allow: POST');
        respond(false, 'method', $lang);
    }
    header('Location: contact.html', true, 303);
    exit;
}

// Champ piège invisible : un robot le remplit, un visiteur non. On simule un succès.
if (post_field('website') !== '') {
    respond(true, 'ok', $lang);
}

$name       = single_line(post_field('name'));
$email      = post_field('email');
$subjectKey = post_field('subject');
$message    = str_replace(["\r\n", "\r"], "\n", post_field('message'));

$valid = $name !== ''
    && char_length($name) <= MAX_NAME
    && strlen($email) <= MAX_EMAIL
    && filter_var($email, FILTER_VALIDATE_EMAIL) !== false
    && isset(SUBJECTS[$subjectKey])
    && char_length($message) >= 2
    && char_length($message) <= MAX_MESSAGE;

if (!$valid) {
    respond(false, 'invalid', $lang);
}

// Limitation simple : un envoi toutes les MIN_DELAY_SECONDS par session
if (session_status() === PHP_SESSION_NONE) {
    session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax']);
}
$now = time();
if (isset($_SESSION['contact_last_sent']) && $now - (int) $_SESSION['contact_last_sent'] < MIN_DELAY_SECONDS) {
    respond(false, 'throttle', $lang);
}

date_default_timezone_set('Europe/Paris');
$subjectLabel = SUBJECTS[$subjectKey];

$mailSubject = encode_header('[Site Carter & Martin] ' . $subjectLabel . ' — ' . $name);

$mailBody = implode("\n", [
    'Nouveau message reçu depuis le formulaire de contact du site Carter & Martin.',
    '',
    'Nom      : ' . $name,
    'Courriel : ' . $email,
    'Objet    : ' . $subjectLabel,
    'Langue   : ' . strtoupper($lang),
    'Date     : ' . date('d/m/Y à H:i'),
    '',
    '--------------------------------------------------',
    '',
    $message,
    '',
    '--------------------------------------------------',
    'Pour répondre, utilisez simplement « Répondre » : le message partira vers ' . $email . '.',
]);

$headers = implode("\r\n", [
    'From: ' . encode_header(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>',
    'Reply-To: ' . encode_header($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: Carter-Martin-Contact',
]);

$sent = USE_ENVELOPE_SENDER
    ? mail(MAIL_TO, $mailSubject, $mailBody, $headers, '-f' . MAIL_FROM)
    : mail(MAIL_TO, $mailSubject, $mailBody, $headers);

if (!$sent) {
    error_log('contact.php : échec de mail() vers ' . MAIL_TO);
    respond(false, 'server', $lang);
}

$_SESSION['contact_last_sent'] = $now;
respond(true, 'ok', $lang);
