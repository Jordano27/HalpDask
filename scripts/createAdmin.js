require('dotenv').config();

const bcrypt = require('bcryptjs');

const db = require('../src/config/database');
const { normalizeEmail, validatePassword, requiredText } = require('../src/utils/validation');

async function main() {
    const nome = requiredText(process.env.ADMIN_NAME, 'ADMIN_NAME');
    const email = normalizeEmail(process.env.ADMIN_EMAIL);
    const senha = validatePassword(process.env.ADMIN_PASSWORD);

    const [existingAdmin] = await db.query(
        'SELECT id FROM ADMINISTRADORES WHERE email = ?',
        [email]
    );
    if (existingAdmin.length > 0) {
        throw new Error('Já existe um administrador com esse e-mail.');
    }

    const [existingRequester, existingTechnician] = await Promise.all([
        db.query('SELECT id FROM SOLICITANTES WHERE email = ?', [email]),
        db.query('SELECT id FROM TECNICOS WHERE email = ?', [email])
    ]);

    if (existingRequester[0].length > 0 || existingTechnician[0].length > 0) {
        throw new Error('O e-mail informado já pertence a outro tipo de usuário.');
    }

    const senhaHash = await bcrypt.hash(senha, 12);
    await db.query(
        'INSERT INTO ADMINISTRADORES (nome, email, senha_hash) VALUES (?, ?, ?)',
        [nome, email, senhaHash]
    );

    console.log(`Administrador ${email} criado com sucesso.`);
}

main()
    .catch((error) => {
        console.error('[ERRO]:', error.message);
        process.exitCode = 1;
    })
    .finally(() => db.end());
