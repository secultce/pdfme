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
    echo file_get_contents(__DIR__ . '/src/templates.json');
} else if ('/templates/create' === $path) {
    $templates = json_decode(file_get_contents(__DIR__ . '/src/templates.json'), true);

    $invalid = validateBody($body, $path);
    if ($invalid) {
        echo json_encode($invalid);
        exit;
    }

    $templates[$body['key']] = $body['template'];

    file_put_contents(__DIR__ . '/src/templates.json', json_encode($templates));
} else if ('/schemas' === $path) {
    echo file_get_contents(__DIR__ . '/src/schemas.json');
}

function validateBody(array $body, string $path): array|true
{
    $map = [
        '/templates/create' => [
            'key' => is_string(...),
            'template' => [
                'schemas' => is_array(...),
                'basePdf' => is_array(...),
            ],
            'schema' => is_string(...),
        ],
    ];

    $invalidBody = [];
    foreach ($map[$path] as $key => $validation) {
        if (!isset($body[$key])) {
            $invalidBody[$key] = 'is required';
            continue;
        }

        if (is_array($validation)) {
            foreach ($validation as $subkey => $callback) {
                if (!isset($body[$key][$subkey])) {
                    $invalidBody[$key][$subkey] = 'is required';
                    continue;
                }

                if (!$callback($body[$key][$subkey])) {
                    $invalidBody[$key][$subkey] = 'invalid value';
                }
            }
        } else {
            $invalidBody[$key] = $validation($body[$key]);
        }
    }

    return $invalidBody ?: false;
}

