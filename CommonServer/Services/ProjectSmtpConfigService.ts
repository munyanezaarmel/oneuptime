import Model from 'Common/Models/ProjectSmtpConfig';
import DatabaseService from './DatabaseService';

class Service extends DatabaseService<Model> {
    public constructor() {
        super(Model);
    }
}
export default new Service();
