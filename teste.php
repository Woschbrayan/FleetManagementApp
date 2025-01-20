<?php

// Configuração de cabeçalhos para permitir chamadas da aplicação
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Conexão com o banco de dados
$host = "45.42.162.162";
$dbname = "syntron_frotas_elo";
$username = "syntron_chico";
$password = "Coxa2021";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro ao conectar ao banco de dados: " . $e->getMessage()]);
    exit;
}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recupera o corpo da requisição
    $input = json_decode(file_get_contents("php://input"), true);

    // Valida os dados recebidos
    $orcamentoId = $input['orc_codigo'] ?? null;
    $osId = $input['os_codigo'] ?? null;

    if (!$orcamentoId || !$osId) {
        echo json_encode(["success" => false, "message" => "Dados inválidos. Informe 'orc_codigo' e 'os_codigo'."]);
        exit;
    }

    try {
        // Inicia uma transação para garantir consistência
        $pdo->beginTransaction();

        // Atualiza o status do orçamento
        $sql = "UPDATE `mov_orcamento` SET `orc_encerrado` = NULL WHERE `orc_codigo` = :orc_codigo";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':orc_codigo' => $orcamentoId]);

        // Atualiza o status da ordem de serviço
        $sqlos = "UPDATE `mov_os` SET `os_status` = 'EO' WHERE `os_codigo` = :os_codigo";
        $stmt = $pdo->prepare($sqlos);
        $stmt->execute([':os_codigo' => $osId]);

        // Confirma a transação
        $pdo->commit();

        echo json_encode(["success" => true, "message" => "Orçamento reaberto com sucesso."]);
    } catch (PDOException $e) {
        // Reverte a transação em caso de erro
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Erro ao reabrir orçamento: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método não permitido. Use POST."]);
}
?>
