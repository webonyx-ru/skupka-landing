<?php

if (isset($_POST['phone'])) {

    $phone = "Телефон:\r\n" . $_POST['phone'] . "\r\n\r\n";

    $form = "Форма отправки: \r\n" . $_POST["form-name"] . "\r\n\r\n";

    $message = ''; //message body

    $message .= $phone.$form;

    if (isset($_POST['text'])) {
        $text = "Текст:\r\n" . $_POST['text'] . "\r\n\r\n";

        $message .= $text;
    }

    $from_email = 'request@skupkanoutbukov.ru'; //sender email
//    $recipient_email = 'yurabogatyrenko@gmail.com'; //recipient email
    $recipient_email = 'skupkanoutbukov@yandex.ru, all.whiteshadow@gmail.com'; //recipient email
    $subject = 'Заявка с сайта -- Скупка ноутбуков'; //subject of email


    $boundary = md5("sanwebe");


//header
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "From: Skupkanoutbukov.ru <" . $from_email . ">\r\n";

    $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

//plain text
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=utf-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($message));


    $sentMail = @mail($recipient_email, $subject, $body, $headers);

    if ($sentMail) {
        echo 'true';
    };
}