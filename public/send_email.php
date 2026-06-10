<?php
/**
 * Skool Video Downloader - Contact Form Handler
 * For use on cPanel / VPS with PHP support.
 */

// 1. Configuration
$to_email = "hello@skoolvideosaver.com";
$from_email = "no-reply@skoolvideosaver.com"; // Set this to an email authorized by your domain
$subject_prefix = "[Skool Video Downloader Contact] ";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 2. Collect and Sanitize Data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject_input = strip_tags(trim($_POST["subject"]));
    $message_input = strip_tags(trim($_POST["message"]));

    // 3. Validation
    if (empty($name) || empty($message_input) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Error handling: redirect back with error or show message
        http_response_code(400);
        echo "Please complete the form correctly.";
        exit;
    }

    // 4. Construct Email
    $email_subject = $subject_prefix . (empty($subject_input) ? "New Message" : $subject_input);
    $email_body = "You have received a new message from your website contact form.\n\n".
                  "Name: $name\n".
                  "Email: $email\n\n".
                  "Message:\n$message_input\n";

    $headers = "From: Skool Video Downloader <$from_email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Send Email
    if (mail($to_email, $email_subject, $email_body, $headers)) {
        // 6. Success: Redirect to thank you page
        header("Location: thank-you.html");
        exit;
    } else {
        // 7. Failure
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    // Not a POST request
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
