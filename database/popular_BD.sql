USE helpdesk_db;

INSERT INTO CATEGORIAS (nome, descricao)
SELECT 'Hardware', 'Computadores, periféricos e equipamentos físicos'
WHERE NOT EXISTS (SELECT 1 FROM CATEGORIAS WHERE nome = 'Hardware');

INSERT INTO CATEGORIAS (nome, descricao)
SELECT 'Software', 'Sistemas operacionais, aplicativos e licenças'
WHERE NOT EXISTS (SELECT 1 FROM CATEGORIAS WHERE nome = 'Software');

INSERT INTO CATEGORIAS (nome, descricao)
SELECT 'Acesso', 'Contas, permissões e acesso aos sistemas'
WHERE NOT EXISTS (SELECT 1 FROM CATEGORIAS WHERE nome = 'Acesso');

INSERT INTO TECNICOS (nome, email)
SELECT 'Ana Lima', 'ana.lima@empresa.com'
WHERE NOT EXISTS (SELECT 1 FROM TECNICOS WHERE email = 'ana.lima@empresa.com');

INSERT INTO TECNICOS (nome, email)
SELECT 'Bruno Martins', 'bruno.martins@empresa.com'
WHERE NOT EXISTS (SELECT 1 FROM TECNICOS WHERE email = 'bruno.martins@empresa.com');

INSERT INTO SOLICITANTES (nome, email, setor)
SELECT 'Maria Oliveira', 'maria.oliveira@empresa.com', 'Financeiro'
WHERE NOT EXISTS (SELECT 1 FROM SOLICITANTES WHERE email = 'maria.oliveira@empresa.com');

INSERT INTO SOLICITANTES (nome, email, setor)
SELECT 'João Santos', 'joao.santos@empresa.com', 'Recursos Humanos'
WHERE NOT EXISTS (SELECT 1 FROM SOLICITANTES WHERE email = 'joao.santos@empresa.com');
