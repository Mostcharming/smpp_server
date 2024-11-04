const pool = require('..')

class DataAdapterInterface {
  constructor (tableName) {
    this.tableName = tableName
  }

  async create (data, requiredFields) {
    try {
      this.validateRequiredFields(data, requiredFields)
      const { query, values } = this.buildInsertQuery(data)
      const conn = await pool.getConnection()
      const result = await conn.query(query, values)
      conn.release()

      const responseData = { ...result[0] }

      return responseData
    } catch (err) {
      throw err
    }
  }

  async update (data, column, value, requiredFields) {
    try {
      this.validateRequiredFields(data, requiredFields)
      if (!column || value === undefined || value === null) {
        throw new Error('Invalid column or value for update operation.')
      }

      const { query, values } = this.buildUpdateQuery(data, column, value)
      const conn = await pool.getConnection()
      const result = await conn.query(query, values)
      conn.release()

      if (result.affectedRows === 0) {
        throw new Error(`${this.tableName.slice(0, -1)} not found`)
      }

      const responseData = { ...data, [column]: value }

      return responseData
    } catch (err) {
      throw err
    }
  }

  async getAll (filter = {}) {
    try {
      const validColumns = await this.getValidColumns()
      let query = `SELECT * FROM ${this.tableName}`
      const values = []
      const filterConditions = []

      if (Object.keys(filter).length > 0) {
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            const snakeKey = this.toSnakeCase(key)
            if (!validColumns.includes(snakeKey)) {
              throw new Error(
                `Column '${snakeKey}' does not exist in table '${this.tableName}'`
              )
            }
            if (key.endsWith('_like')) {
              filterConditions.push(`${snakeKey} LIKE ?`)
              values.push(`%${filter[key]}%`)
            } else {
              filterConditions.push(`${snakeKey} = ?`)
              values.push(filter[key])
            }
          }
        }
      }

      if (filterConditions.length > 0) {
        query += ` WHERE ${filterConditions.join(' AND ')}`
      }

      const conn = await pool.getConnection()
      const rows = await conn.query(query, values)
      conn.release()

      return rows
    } catch (err) {
      throw err
    }
  }

  async findOne (filter) {
    try {
      const validColumns = await this.getValidColumns()
      const filterConditions = []
      const values = []

      for (const key in filter) {
        if (filter.hasOwnProperty(key)) {
          const snakeKey = this.toSnakeCase(key)
          if (!validColumns.includes(snakeKey)) {
            throw new Error(
              `Column '${snakeKey}' does not exist in table '${this.tableName}'`
            )
          }
          filterConditions.push(`${snakeKey} = ?`)
          values.push(filter[key])
        }
      }

      if (filterConditions.length === 0) {
        throw new Error('No valid filter conditions provided for findOne.')
      }

      const query = `SELECT * FROM ${
        this.tableName
      } WHERE ${filterConditions.join(' AND ')} LIMIT 1`

      const conn = await pool.getConnection()
      const rows = await conn.query(query, values)
      conn.release()

      return rows.length > 0 ? rows[0] : null
    } catch (err) {
      throw err
    }
  }

  async getValidColumns () {
    const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?`
    const conn = await pool.getConnection()
    const rows = await conn.query(query, [this.tableName])
    conn.release()
    return rows.map(row => row.COLUMN_NAME)
  }

  validateRequiredFields (data, requiredFields) {
    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
  }

  buildInsertQuery (data) {
    const columns = Object.keys(data)
      .map(col => this.toSnakeCase(col))
      .join(', ')
    const values = Object.values(data)
    const placeholders = values.map(() => '?').join(', ')
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`
    return { query, values }
  }

  buildUpdateQuery (data, column, value) {
    const columns = Object.keys(data)
      .map(col => `${this.toSnakeCase(col)} = ?`)
      .join(', ')
    const values = [...Object.values(data), value]
    const query = `UPDATE ${
      this.tableName
    } SET ${columns}, updated_at = CURRENT_TIMESTAMP WHERE ${this.toSnakeCase(
      column
    )} = ?`
    return { query, values }
  }

  toSnakeCase (str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }
}

module.exports = DataAdapterInterface
