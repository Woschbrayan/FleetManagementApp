<?php
// Configuração do banco de dados
$host = "localhost";
$dbname = "frotas";
$username = "root";
$password = "";

// Conexão com o banco de dados
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Erro ao conectar ao banco de dados: " . $e->getMessage()]));
}

// Recebe os dados enviados no corpo da requisição
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['usu_login']) && isset($data['usu_senha'])) {
    $usu_login = $data['usu_login'];
    $usu_senha = $data['usu_senha'];
    $usu_login = 'admin';
    $usu_senha = 'admin';



    // Prepara e executa a consulta
    $stmt = $pdo->prepare("SELECT * FROM cad_usuario WHERE usu_login = :usu_login");
    $stmt->bindParam(':usu_login', $usu_login);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($usu_senha, $user['usu_senha'])) {
        echo json_encode(["status" => "success", "message" => "Login realizado com sucesso."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuário ou senha inválidos."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Dados insuficientes."]);
}
?>
