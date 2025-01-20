<?php

// Configurações do banco de dados
$dbHost = '45.42.162.162'; // Host do banco de dados
$dbName = 'syntron_frotas_elo'; // Nome do banco de dados
$dbUser = 'syntron_chico'; // Usuário do banco de dados
$dbPass = 'Coxa2021'; // Senha do banco de dados

header('Content-Type: application/json');

try {
    // Conexão com o banco de dados usando PDO
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica se os dados necessários foram enviados
    if (
        !isset($_POST['name']) || empty($_POST['name']) ||
        !isset($_POST['cpf']) || empty($_POST['cpf']) ||
        !isset($_POST['description']) || empty($_POST['description']) ||
        !isset($_FILES['photo'])
    ) {
        echo json_encode([
            'error' => true,
            'message' => 'Todos os campos são obrigatórios.'
        ]);
        exit;
    }

    // Captura os dados enviados
    $name = $_POST['name'];
    $cpf = $_POST['cpf'];
    $description = $_POST['description'];

    // Tratamento do upload da foto
    $photo = $_FILES['photo'];
    if ($photo['error'] !== UPLOAD_ERR_OK) {
        echo json_encode([
            'error' => true,
            'message' => 'Erro ao fazer upload da foto.'
        ]);
        exit;
    }

    // Lê o conteúdo do arquivo de foto
    $photoData = file_get_contents($photo['tmp_name']);

    // Insere os dados na tabela `registros_assinatura`
    $sql = "
        INSERT INTO registros_assinatura (nome, cpf, observacao, foto, data)
        VALUES (:nome, :cpf, :observacao, :foto, NOW())
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nome', $name);
    $stmt->bindParam(':cpf', $cpf);
    $stmt->bindParam(':observacao', $description);
    $stmt->bindParam(':foto', $photoData, PDO::PARAM_LOB);

    // Executa a query
    if ($stmt->execute()) {
        echo json_encode([
            'error' => false,
            'message' => 'Registro inserido com sucesso!'
        ]);
    } else {
        echo json_encode([
            'error' => true,
            'message' => 'Erro ao inserir o registro.'
        ]);
    }
} catch (PDOException $e) {
    // Tratamento de erros no banco de dados
    echo json_encode([
        'error' => true,
        'message' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()
    ]);
}
