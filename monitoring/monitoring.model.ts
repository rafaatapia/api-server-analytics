import * as mongoose from 'mongoose';

export interface Monitoring extends mongoose.Document {  
  empresa: string,
  memoria_total: number,
  memoria_usada: number,
  memoria_livre: number,
  discos: JSON[],
  cpu_usado: number,
  data_registro: Date  
}

export interface MonitoringModel extends mongoose.Model<Monitoring> {
  findByEmpresa(empresa: string): Promise<Monitoring>
}

const monitoringSchema = new mongoose.Schema({
  empresa: {
    type: String,    
    required: [true, 'É necessário informar o nome da empresa.']    
  },
  memoria_total: {
    type: Number,
    required: true
  },
  memoria_usada: {
    type: Number,
    required: true
  },
  memoria_livre: {
    type: Number,
    required: true
  },
  discos: {
    type: [JSON],    
  },
  cpu_usado: {
    type: Number,
    required: true
  },
  data_registro: {
    type: Date,    
    default: Date.now    
  }
});

monitoringSchema.statics.findByEmpresa = function(empresa: string) {
  return this.find({ empresa });
}

export const Monitoring = mongoose.model<Monitoring, MonitoringModel>('Monitoring', monitoringSchema);
