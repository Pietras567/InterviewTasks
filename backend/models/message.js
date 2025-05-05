import {DataTypes, Model} from 'sequelize';
import sequelize from '../utils/database.js';

class Message extends Model {
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sentAt: {
            field: 'sent_at',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: false,
        underscored: true,
    }
);

export default Message;
