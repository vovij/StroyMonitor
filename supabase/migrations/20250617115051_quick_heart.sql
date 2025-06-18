/*
  # Email Authentication Setup

  1. Email Templates
    - Create custom HTML email templates for confirmation and password reset
    - Configure email settings for better user experience

  2. Auth Configuration
    - Enable email confirmation
    - Set up custom email templates
    - Configure redirect URLs
*/

-- Enable email confirmation (this will be configured in Supabase dashboard)
-- But we can set up the email templates here

-- Create a function to send custom emails (this is a placeholder - actual email sending is handled by Supabase Auth)
CREATE OR REPLACE FUNCTION public.get_custom_email_template(template_type text)
RETURNS text AS $$
BEGIN
  CASE template_type
    WHEN 'confirmation' THEN
      RETURN '
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение регистрации - СтройМонитор</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .subtitle { color: #bfdbfe; font-size: 16px; }
        .content { padding: 40px 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 16px; }
        .text { color: #64748b; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏗️ СтройМонитор</div>
            <div class="subtitle">Система контроля затрат строительных проектов</div>
        </div>
        <div class="content">
            <h1 class="title">Добро пожаловать в СтройМонитор!</h1>
            <p class="text">
                Спасибо за регистрацию в нашей системе контроля затрат строительных проектов. 
                Для завершения регистрации, пожалуйста, подтвердите ваш email-адрес.
            </p>
            <p class="text">
                Нажмите на кнопку ниже, чтобы подтвердить ваш аккаунт:
            </p>
            <a href="{{ .ConfirmationURL }}" class="button">Подтвердить email</a>
            <p class="text">
                Если кнопка не работает, скопируйте и вставьте эту ссылку в ваш браузер:<br>
                <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
            </p>
            <p class="text">
                После подтверждения вы сможете:
            </p>
            <ul style="color: #64748b; line-height: 1.6;">
                <li>Создавать и управлять строительными проектами</li>
                <li>Отслеживать затраты по категориям</li>
                <li>Контролировать бюджет в реальном времени</li>
                <li>Анализировать статистику проектов</li>
            </ul>
        </div>
        <div class="footer">
            <p>Если вы не регистрировались в СтройМонитор, просто проигнорируйте это письмо.</p>
            <p>© 2024 СтройМонитор. Все права защищены.</p>
        </div>
    </div>
</body>
</html>';
    WHEN 'recovery' THEN
      RETURN '
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Восстановление пароля - СтройМонитор</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 8px; }
        .subtitle { color: #fecaca; font-size: 16px; }
        .content { padding: 40px 20px; }
        .title { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 16px; }
        .text { color: #64748b; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏗️ СтройМонитор</div>
            <div class="subtitle">Система контроля затрат строительных проектов</div>
        </div>
        <div class="content">
            <h1 class="title">Восстановление пароля</h1>
            <p class="text">
                Мы получили запрос на восстановление пароля для вашего аккаунта в СтройМонитор.
            </p>
            <p class="text">
                Нажмите на кнопку ниже, чтобы создать новый пароль:
            </p>
            <a href="{{ .ConfirmationURL }}" class="button">Восстановить пароль</a>
            <p class="text">
                Если кнопка не работает, скопируйте и вставьте эту ссылку в ваш браузер:<br>
                <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
            </p>
            <div class="warning">
                <strong>⚠️ Важно:</strong> Эта ссылка действительна в течение 1 часа. 
                Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
            </div>
        </div>
        <div class="footer">
            <p>Если у вас возникли проблемы, свяжитесь с нашей службой поддержки.</p>
            <p>© 2024 СтройМонитор. Все права защищены.</p>
        </div>
    </div>
</body>
</html>';
    ELSE
      RETURN 'Default email template';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;