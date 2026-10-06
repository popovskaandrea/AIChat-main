import "dotenv/config";
import mysql from "mysql2";

export const pool = mysql
    .createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
    })
    .promise();

export const getAllRows = async (table, orderBy="ASC") => {
    try {
        const [result] = await pool.query(`SELECT * FROM ${table}
            ORDER BY id ${orderBy} 
            `)
        return result;
    }
    catch (error) {
        console.error(error)
    }
}

export const getRowsFromRangeAll = async (table, offset, limit, orderBy="ASC") => {
    try {
        const [result] = await pool.query(`SELECT * FROM ${table}
            ORDER BY id ${orderBy} 
            LIMIT ${offset}, ${limit}
            `)
        return result;
    }
    catch (error) {
        console.error(error)
    }
}

export const getRowsFromRange = async (table, offset, limit, column, value, orderBy="ASC") => {
    try {
        if (!Array.isArray(column)) {
            const [result] = await pool.query(`SELECT * FROM ${table}
                WHERE ${column} = ?
                ORDER BY id ${orderBy} 
                LIMIT ${offset}, ${limit}
                `, [value])
            return result;
        } else {
            const [result] = await pool.query(`SELECT * FROM ${table}
                WHERE ${column[0]} = ? AND ${column[1]} = ?
                ORDER BY id ${orderBy} 
                LIMIT ${offset}, ${limit}
                `, [value[0], value[1]])
            return result;
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const getRow = async (table, column, value, orderBy, type) => {
    try {
        if (!Array.isArray(column) && !Array.isArray(value)) {
            const [result] = await pool.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
            return result[0];
        } else {
            let string = ""
            for (let i = 0; i < column.length; i++) {
                string += `${column[i]} = ? AND `
            }
            const col = string.slice(0, -5)
            const [result] = await pool.query(`SELECT * FROM ${table} WHERE ${col}`, value);
            return result[0];
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const getRows = async (table, column, value, orderBy=false, type="ASC") => {
    try {
        if (!Array.isArray(column) && !Array.isArray(value)) {
            if (orderBy) {
                const [result] = await pool.query(`SELECT * FROM ${table} WHERE ${column} = ? ORDER BY ${orderBy} ${type}`,
                    [value]);
                return result;
            } else {
                const [result] = await pool.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [value]);
                return result;
            }
        } else {
            let string = ""
            for (let i = 0; i < column.length; i++) {
                string += `${column[i]} = ? AND `
            }
            const col = string.slice(0, -5)
            const [result] = await pool.query(`SELECT * FROM ${table} WHERE ${col}`, value);
            return result;
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const desc = async (table) => {
    try {
        const [result] = await pool.query(`DESC ${table}`);
        return result;
    }
    catch (error) {
        console.error(error)
    }
}

export const insertRow = async (table, arr) => {
    try {
        const describe = await desc(table)
        let filds = []
        for (let i = 0; i < describe.length; i++) {
            if (describe[i].Field !== "id" && !describe[i].Field.endsWith("_at")) {
                filds.push(describe[i].Field)
            }
        }


        let string = ""
        let mark = ""
        for (let i = 0; i < filds.length; i++) {
            string += `${filds[i]}, `
            mark += `?, `
        }


        const names = string.slice(0, -2)
        const questionMark = mark.slice(0, -2)
        const insert = await pool.query(`
            INSERT INTO ${table} (${names})
            VALUES (${questionMark})
            `, arr
        )
        return insert;
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

export const updateRow = async (table, set, column, arr) => {
    try {
        if (!Array.isArray(set)) {
            const update = await pool.query(`UPDATE ${table} SET ${set} = ? WHERE ${column} = ?`, arr)
            return update
        } else {
            let string = ""
            for (let i = 0; i < set.length; i++) {
                string += `${set[i]} = ?, `
            }
            const s = string.slice(0, -5)
            const update = await pool.query(`UPDATE ${table} SET ${s} = ? WHERE ${column} = ?`, arr)
            return update
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const updateIncRow = async (table, set, column, arr2) => {
    try {
        const update = await pool.query(`UPDATE ${table} SET ${set} = ${set} + ? WHERE ${column} = ?`, arr2)
        return update
    }
    catch (error) {
        console.error(error)
    }
}

export const deleteRow = async (table, column, value) => {
    try {
        if (!Array.isArray(column) && !Array.isArray(value)) {
            const deleteR = await pool.query(`DELETE FROM ${table} WHERE ${column} = ?`, value)
            return deleteR;
        } else {
            let string = ""
            for (let i = 0; i < column.length; i++) {
                string += `${column[i]} = ? AND `
            }
            const col = string.slice(0, -5)
            const [result] = await pool.query(`DELETE FROM ${table} WHERE ${col}`, value);
            return result;
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const countRows = async (table, exp1, exp2, value1, value2) => {
    const [count] = await pool.query(`SELECT COUNT(${exp1}) FROM ${table}
        WHERE ${exp1} = ${value1}
        AND ${exp2} = ${value2}
        `)
    return count[0]
}

export const countRowsCondition = async (table, condition, value) => {
    const [count] = await pool.query(`SELECT COUNT(*) FROM ${table} WHERE ${condition} = ${value}`);
    return count[0];
}

export const countAllRows = async (table) => {
    const [count] = await pool.query(`SELECT COUNT(^) FROM ?`, table);
    return count[0];
}
