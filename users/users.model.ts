import * as mongoose from 'mongoose';
import { validateCPF } from '../common/validators';
import * as bcrypt from 'bcrypt';
import { environment } from '../common/environment';

export interface User extends mongoose.Document {
  isAtivo: boolean,
  nome: string,
  login: string,
  senha: string,
  email: string,
  perfilAcesso: string[],
  sexo: string,
  telefone: string[],
  dataCadastro: Date,
  dataNascimento: Date,
  matches(senha: string): boolean,
  hasAny(...profiles: string[]): boolean
}

export interface UserModel extends mongoose.Model<User> {
  findByLogin(login: string, projection?: string): Promise<User>
}

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

userSchema.statics.findByLogin = function(login: string, projection: string) {
  return this.findOne({ login }, projection); //{login: login}
}

userSchema.methods.matches = function(senha: string): boolean {
  return bcrypt.compareSync(senha, this.senha);
}

userSchema.methods.hasAny = function(...perfilAcesso: string[]): boolean {
  return perfilAcesso.some(profile => this.perfilAcesso.indexOf(perfilAcesso) !== -1)
}

// Cria o hash para armazenar a senha no banco.
const hashPassword = (obj, next) => {
  bcrypt.hash(obj.senha, environment.security.saltRounds)
    .then(hash => {
      obj.senha = hash;
      next();
    }).catch(next);
}

// Altera o password pelo hash quando é inserido um usuario
const saveMiddleware = function(next) {
  const user: any = this;
  if (!user.isModified('senha')) {
    next();
  } else {
    hashPassword(user, next);
  }
}

// Altera o password pelo hash quando é atualizado um usuario
const updateMiddleware = function(next) {
  if (!this.getUpdate().senha) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
}

// antes de salvar o usuario, faz a criptografia
userSchema.pre('save', saveMiddleware);
// antes de atualizar o usuario, faz a criptografia
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongoose.model<User, UserModel>('User', userSchema);
