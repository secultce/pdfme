<?php

header('Access-Control-Allow-Origin: *');

$path = $_SERVER['PATH_INFO'] ?? '';
$body = file_get_contents('php://input');
if (is_string($body)) {
    $body = json_decode($body, true);
}

if ('' === $path || '/' === $path) { ?>
    <style>
        ul {
            list-style-type: none;
            padding-left: 20px;
            border-left: 1px dotted #ccc;
        }

        li::before {
            content: "📄 ";
        }
    </style>
    <ul>
        <li>/schemas</li>
        <li>/templates</li>
        <li>/templates/create</li>
    </ul>
<?php } else if ('/templates' === $path) {
    echo file_get_contents(__DIR__ . '/data/templates.json');
} else if ('/templates/save' === $path) {
    $templates = json_decode(file_get_contents(__DIR__ . '/data/templates.json'), true);

    $errors = [];
    $valid = validateBody($body, $path, $errors);
    if (!$valid) {
        header("HTTP/1.0 400 Bad Request");
        echo json_encode($errors);
        exit;
    }

    $templateKey = array_find_key($templates, fn ($template) => $template['key'] === $body['key']);
    if (is_null($templateKey)) {
        $templates[] = $body;
    } else {
        $templates[$templateKey] = $body;
    }

    file_put_contents(__DIR__ . '/data/templates.json', json_encode($templates));
} else if ('/schemas' === $path) {
    echo file_get_contents(__DIR__ . '/data/schemas.json');
}

function validateBody(array $body, string $path, ?array &$errors = []): bool
{
    $errors = [];

    $map = [
        '/templates/save' => [
            'key' => is_string(...),
            'name' => is_string(...),
            'schemaKey' => is_string(...),
            'template' => [
                'schemas' => is_array(...),
                'basePdf' => is_array(...),
            ],
        ],
    ];

    foreach ($map[$path] as $key => $validation) {
        if (!isset($body[$key])) {
            $errors[$key] = 'is required';
            continue;
        }

        if (is_array($validation)) {
            foreach ($validation as $subkey => $callback) {
                if (!isset($body[$key][$subkey])) {
                    $errors[$key][$subkey] = 'is required';
                    continue;
                }

                if (!$callback($body[$key][$subkey])) {
                    $errors[$key][$subkey] = 'invalid value';
                }
            }
        } else {
            if (!$validation($body[$key])) {
                $errors[$key] = 'invalid value';
            }
        }
    }

    return empty($errors);
}

