Passos para iniciar o app!!!

1 - Criar Banco de dados.

CREATE DATABASE loja_app;
USE loja_app;

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100)
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  produto VARCHAR(200),
  valor DECIMAL(10,2),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

2 - molde db.js

Mude o user e senha para acessar o banco de acordo com o root do seu computador

3 - inicie o aplicativo

Abra dois cmd's (Powershell que seja).

use cd ..\ReactNativeAtvds\meuAppClientesPedidos\frontend2 para acessar a interface

use cd ..cd ..\ReactNativeAtvds\meuAppClientesPedidos\backend para acessar o código fonte

no cmd backend execute: node src/server.js

agora no cmd do frontend2 execute o comando: npx expo start, após clique A para selecionar android.

4 - usar o app
