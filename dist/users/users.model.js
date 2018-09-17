"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const environment_1 = require("../common/environment");
const userSchema = new mongoose.Schema({
    isAtivo: {
        type: Boolean,
        required: true
    },
    nome: {
        type: String,
        required: true,
        minlength: 3
    },
    login: {
        type: String,
        unique: true,
        required: true,
        minlength: 5
    },
    senha: {
        type: String,
        required: true,
        select: false,
        minlength: 5,
    },
    email: {
        type: String,
        required: false,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    perfilAcesso: {
        type: [String],
        required: true
    },
    sexo: {
        type: String,
        required: true,
        enum: ['Masculino', 'Feminino']
    },
    telefone: {
        type: [String],
        requied: false
    },
    dataCadastro: {
        type: Date,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    }
});
userSchema.statics.findByLogin = function (login, projection) {
    return this.findOne({ login }, projection); //{login: login}
};
userSchema.methods.matches = function (senha) {
    return bcrypt.compareSync(senha, this.senha);
};
userSchema.methods.hasAny = function (...perfilAcesso) {
    return perfilAcesso.some(profile => this.perfilAcesso.indexOf(perfilAcesso) !== -1);
};
// Cria o hash para armazenar a senha no banco.
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.senha, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.senha = hash;
        next();
    }).catch(next);
};
// Altera o password pelo hash quando é inserido um usuario
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('senha')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
// Altera o password pelo hash quando é atualizado um usuario
const updateMiddleware = function (next) {
    if (!this.getUpdate().senha) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
// antes de salvar o usuario, faz a criptografia
userSchema.pre('save', saveMiddleware);
// antes de atualizar o usuario, faz a criptografia
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=users.model.js.map