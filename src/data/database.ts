import {ScoreRepository} from "./repositories/score-repository.js";
import config from "./config/database.config.js";
import {Sequelize} from "sequelize-typescript";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export class AppDatabase {
    private static instance: AppDatabase;
    private readonly sequelize: Sequelize;
    private scoreRepository: ScoreRepository;

    public static getInstance(): AppDatabase {
        if (!AppDatabase.instance) {
            AppDatabase.instance = new AppDatabase();
        }
        return AppDatabase.instance;
    }

    public getSequelize(): Sequelize {
        return this.sequelize;
    }

    public async sync(): Promise<void> {
        if (process.env.NODE_ENV === "production") {
            throw new Error("Don't use sync in production")
        }

        await this.sequelize.sync();
    }


    private constructor() {
        this.sequelize = new Sequelize(config);
        this.sequelize.addModels([this.getModelPath()])
        this.scoreRepository = new ScoreRepository(this.sequelize);
    }

    private getModelPath(): string {
        const __filename =  fileURLToPath(import.meta.url);
        return join(dirname(__filename), '../models');
    }


}