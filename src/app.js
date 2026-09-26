const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const tecnicoRoutes = require('./routes/tecnicoRoutes');
const solicitanteRoutes = require('./routes/solicitanteRoutes');
const chamadoRoutes = require('./routes/chamadoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const { AppError } = require('./utils/customErrors');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.json({ name: 'HelpDesk API', version: '1.0.0', health: '/health' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

app.use('/categorias', authMiddleware, categoriaRoutes);
app.use('/tecnicos', tecnicoRoutes);
app.use('/solicitantes', solicitanteRoutes);
app.use('/chamados', authMiddleware, chamadoRoutes);
app.use('/relatorios', authMiddleware, relatorioRoutes);

app.use((req, res, next) => {
    next(new AppError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'JSON inválido no corpo da requisição.', status: 400 });
    }
    return next(err);
});

app.use(errorMiddleware);

module.exports = app;
