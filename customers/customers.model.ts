import * as mongoose from 'mongoose';

export interface Customer extends mongoose.Document {
  isAtivo: boolean,
  nome: string,
  codigo: number,
  sexo: string,
  observacao: string,
  dataNascimento: Date,
  logradouro: string,
  numero: string,
  bairro: string,
  cep: number,
  cidade: JSON,
  telefone: string,
  profissao: string,
  telefoneAdicional: string,
  estadoCivil: string,
  dataCadastro: Date,
  indicacao: JSON
}

export interface CustomerModel extends mongoose.Model<Customer> {
  findByNome(nome: string, projection?: string): Promise<Customer>
  findByCodigo(codigo: number, projection?: string): Promise<Customer>
}

const customerSchema = new mongoose.Schema({
  isAtivo: {
    type: Boolean,
    required: true
  },
  nome: {
    type: String,
    required: true,
    minlength: 3
  },
  codigo: {
    type: Number,
    required: true,
    unique: true
  },
  dataNascimento: Date,
  logradouro: String,
  numero: String,
  bairro: String,
  cep: Number,
  cidade: {
      nome: String,
      estado: String
  },
  telefone: {
    type: String,
    requied: false
  },
  profissao: String,
  telefoneAdicional: String,
  estadoCivil: String,
  dataCadastro: {
    type: Date,
    required: true  
  },
  indicacao: {
      nome: String,
      telefone: String
  }
});

customerSchema.statics.findByNome = function(nome: string, projection: string) {
  return this.findOne({ nome }, projection);
}

customerSchema.statics.findByCodigo = function(codigo: number, projection: string) {
    return this.findOne({ codigo }, projection);
}

export const Customer = mongoose.model<Customer, CustomerModel>('Customer', customerSchema);
