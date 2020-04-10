import * as SQLite from 'expo-sqlite';

import PassportForm from './PassportForm';

class Database {
    constructor() {
        this.db = SQLite.openDatabase('db.db');
    }

    static getInstance() {
        if (!this.instance)
            this.instance = new Database();
        return this.instance;
    }

    initialize(onDatabaseInitialized) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                CREATE TABLE IF NOT EXISTS passport_form (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    date TEXT,
                    name TEXT,
                    surname TEXT,
                    pesel TEXT,
                    sex TEXT,
                    is_male INTEGER,
                    email TEXT,
                    phone TEXT,
                    birth_day INTEGER,
                    birth_month INTEGER,
                    birth_year INTEGER,
                    rodo INTEGER,
                    file TEXT
                );`,
            [], () => onDatabaseInitialized(),
            (transaction, error) => console.log(error));
        });
    }

    insert(passportForm, onInserted) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                INSERT INTO passport_form (
                    date,
                    name,
                    surname,
                    pesel,
                    sex,
                    is_male,
                    email,
                    phone,
                    birth_day,
                    birth_month,
                    birth_year,
                    rodo,
                    file
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
                    passportForm.date,
                    passportForm.name,
                    passportForm.surname,
                    passportForm.pesel,
                    passportForm.sex,
                    passportForm.isMale,
                    passportForm.email,
                    passportForm.phone,
                    passportForm.birthDay,
                    passportForm.birthMonth,
                    passportForm.birthYear,
                    passportForm.rodo,
                    passportForm.file,
                ], (transaction, resultSet) => {
                    passportForm.id = resultSet.insertId;
                    onInserted(resultSet.insertId);
                },
                (transaction, error) => console.log(error));
        });
    }

    update(passportForm, onUpdated) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                UPDATE passport_form
                SET
                    date = ?,
                    name = ?,
                    surname = ?,
                    pesel = ?,
                    sex = ?,
                    is_male = ?,
                    email = ?,
                    phone = ?,
                    birth_day = ?,
                    birth_month = ?,
                    birth_year = ?,
                    rodo = ?,
                    file = ?
                WHERE id = ?;`, [
                    passportForm.date,
                    passportForm.name,
                    passportForm.surname,
                    passportForm.pesel,
                    passportForm.sex,
                    passportForm.isMale,
                    passportForm.email,
                    passportForm.phone,
                    passportForm.birthDay,
                    passportForm.birthMonth,
                    passportForm.birthYear,
                    passportForm.rodo,
                    passportForm.file,
                    passportForm.id
                ], () => onUpdated(),
                (transaction, error) => console.log(error));
        });
    }

    deleteMany(passportForms, onDeleted) {
        let ids = [];
        let separator = '';
        let placeholders = '(';
        for (let passportForm of passportForms) {
            placeholders += separator + '?';
            separator = ', ';
            ids.push(passportForm.id);
        }
        placeholders += ');';

        this.db.transaction(transaction => {
            transaction.executeSql(`
                DELETE FROM passport_form
                WHERE id IN ` + placeholders, ids, 
                (transaction, resultSet) => onDeleted(),
                (transaction, error) => console.log(error));
        });
    }

    loadData(onDataLoaded) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                SELECT *
                FROM passport_form;`,
            [], (transaction, resultSet) => onDataLoaded(this.convertList(resultSet.rows._array)),
            (transaction, error) => console.log(error));
        });
    }

    clear(onCleared) {
        this.db.transaction(transaction => {
            transaction.executeSql(`
                DROP TABLE passport_form;`,
            [], () => onCleared(),
            (transaction, error) => console.log(error));
        });
    }

    convertList(dataList) {
        let output = [];
        for (let dataObject of dataList)
            output.push(this.convert(dataObject));
        return output;
    }

    convert(dataObject) {
        return new PassportForm(
            dataObject['id'],
            dataObject['date'],
            dataObject['name'],
            dataObject['surname'],
            dataObject['pesel'],
            dataObject['sex'],
            !!dataObject['is_male'],
            dataObject['email'],
            dataObject['phone'],
            dataObject['birth_day'],
            dataObject['birth_month'],
            dataObject['birth_year'],
            !!dataObject['rodo'],
            dataObject['file']
        );
    }
}

export default Database;