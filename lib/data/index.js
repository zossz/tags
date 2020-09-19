const debug = require('debug')('tags:server:data')

const { Sequelize, DataTypes } = require('sequelize')

const env = process.env.NODE_ENV || 'development'

const pool = {
  acquire: process.env.SQLITE_POOL_ACQUIRE || 20000,
  idle: process.env.SQLITE_POOL_IDLE || 10000,
  max: process.env.SQLITE_POOL_MAX || 5,
  min: process.env.SQLITE_POOL_MIN || 1
}
const storage = process.env.SQLITE_STORAGE_PATH || 'var/db.sqlite'

const config = {
  define: {
    charset: 'utf8',
    freezeTableName: true,
    timestamps: true
  },
  dialect: 'sqlite',
  hooks: {
    /* beforeConnect, */
    /* afterConnect, */
    /* beforeDisconnect, */
    /* afterDisconnect, */
    /* etc. -- more below */
  },
  pool,
  storage
  // sync: { alter: true }, // apply migrations
  // sync: { force: true }, // recreate from scratch
  // transactionType: Sequelize.Transaction.TYPES.*
  // isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.*
}

const data = {
  Sequelize,
  init
}

const options = {
  createdAt: 'creationDate',
  updatedAt: 'lastModificationDate'
}

const models = [
  {
    namespace: 'Tag',
    version: 1,
    context: Object.assign({}, options, {
      defaultScope: {
        
      },
      scopes: {
        user: {
          
        }
      },
    }),
    table: {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
      },
      timestamp: {
        allowNull: false,
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('timestamp').valueOf()
        }
      },
      value1: {
        allowNull: false,
        // defaultValue: 'foo',
        type: DataTypes.STRING
      },
      value2: {
        allowNull: false,
        // defaultValue: 0.02,
        type: DataTypes.FLOAT
      },
      value3: {
        allowNull: false,
        // defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      creationDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: DataTypes.DATE
      },
      lastModificationDate: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
        type: DataTypes.DATE
      }
    }
  }
]

async function init () {
  const namespace = {}
  if (env !== 'development') {
    config.logging = false
  }
  try {
    data.sequelize = new Sequelize(config)
    models.forEach(x => {
      debug({ model: x })
      let args = [ x.namespace, x.table, x.context || options ]
      namespace[x.namespace] = data.sequelize.define(...args)
    })
    Object.keys(namespace).forEach(x => {
      if (namespace[x].associate) {
        debug({ namespace: x })
        namespace[x].associate(namespace)
      }
    })
    await data.sequelize.sync()
    data.namespace = namespace
  } catch (error) {
    debug({ error })
  }
}

module.exports = data

/* ORM hooks available: [
    beforeValidate, afterValidate,
    validationFailed,
    beforeCreate, afterCreate,
    beforeDestroy, afterDestroy,
    beforeRestore, afterRestore,
    beforeUpdate, afterUpdate,
    beforeSave, afterSave,
    beforeUpsert, afterUpsert,
    beforeBulkCreate, afterBulkCreate,
    beforeBulkDestroy, afterBulkDestroy,
    beforeBulkRestore, afterBulkRestore,
    beforeBulkUpdate, afterBulkUpdate,
    beforeFind, afterFind,
    beforeFindAfterExpandIncludeAll,
    beforeFindAfterOptions,
    beforeCount,
    beforeDefine, afterDefine,
    beforeInit, afterInit,
    beforeAssociate, afterAssociate,
    beforeConnect, afterConnect,
    beforeDisconnect, afterDisconnect,
    beforeSync, afterSync,
    beforeBulkSync, afterBulkSync,
    beforeQuery, afterQuery
] */
