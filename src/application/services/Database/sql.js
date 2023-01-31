/**users */
export const CREATETABLEUSER = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    nombres TEXT NOT NULL,
    apellidos TEXT,
    bodegaId TEXT,
    bodegaNombre TEXT,
    token TEXT,
    refreshToKen TEXT,
    lastAccess DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLEUSER = `DROP TABLE IF EXISTS users`;
export const SAVEUSER = `INSERT INTO users (username, nombres, apellidos, token, refreshToKen, lastAccess, bodegaId, bodegaNombre) 
    VALUES (?,?,?,?,?,?,?,?)`;

export const REMOVEUSER = ` DELETE FROM users `;

export const GETUSER = ` SELECT username, nombres, apellidos, bodegaId, bodegaNombre, token, refreshToKen, lastAccess, bodegaId, bodegaNombre
    FROM users 
    ORDER BY lastaccess DESC 
    LIMIT 1 `;
/** */

/**productos */
export const CREATETABLEPRODUCTO = `CREATE TABLE IF NOT EXISTS productos (
    nombre TEXT NOT NULL,
    codigo  INTEGER PRIMARY KEY NOT NULL,
    codigoInterno TEXT NOT NULL,
    marca INTEGER NULL REFERENCES marcas(codigo) ON DELETE NO ACTION,
    serie TEXT NOT NULL,
    tipo TEXT NOT NULL,
    unidad INTEGER REFERENCES unidades(codigo) ON DELETE NO ACTION,
    color INTEGER REFERENCES colores(codigo) ON DELETE NO ACTION,
    centroCosto TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLEPRODUCTO = `DROP TABLE IF EXISTS productos`;
export const SAVEPRODUCTO = `INSERT INTO productos (nombre, codigo, codigoInterno, marca, serie, tipo, unidad, color, centroCosto, createdAt) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`;

export const REMOVEPRODUCTO = ` DELETE FROM productos `;

export const GETPRODUCTO = ` SELECT nombre, codigo, codigoInterno, marca, serie, tipo, unidad, color, centroCosto, createdAt
    FROM productos 
    ORDER BY nombre DESC`;

export const GETPRODUCTOID = ` SELECT a.nombre, a.codigo, a.codigoInterno, a.marca, a.serie, a.tipo, a.unidad, a.color, a.centroCosto, a.createdAt, b.nombre nombreUnidad
    FROM productos a LEFT JOIN unidades b ON b.codigo = a.unidad
    Where codigoInterno = ?
    ORDER BY a.nombre DESC`;

export const SAVEPRODUCTOS = `INSERT  INTO productos(nombre, codigo, codigoInterno, marca, serie, tipo, unidad, color, centroCosto, createdAt) values`;
/** */

/**bodegas */
export const CREATETABLEBODEGA = `CREATE TABLE IF NOT EXISTS bodegas (
    nombre TEXT NOT NULL,
    codigo  INTEGER NOT NULL PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLEBODEGA = `DROP TABLE IF EXISTS bodegas`;
export const SAVEBODEGA = `INSERT INTO bodegas (nombre, codigo, createdAt) 
    VALUES (?,?,?)`;

export const REMOVEBODEGA = ` DELETE FROM bodegas `;

export const GETBODEGA = ` SELECT nombre, codigo, createdAt
    FROM bodegas 
    ORDER BY nombre DESC 
     `;

export const SAVEBODEGAS = `INSERT  INTO bodegas(codigo, nombre, createdAt) values`;
/** */

/**conductores */
export const CREATETABLECONDUCTOR = `CREATE TABLE IF NOT EXISTS conductores (
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    codigo  INTEGER NOT NULL PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLECONDUCTOR = `DROP TABLE IF EXISTS conductores `;
export const SAVECONDUCTOR = `INSERT INTO conductores (nombre, apellido, codigo, createdAt) 
    VALUES (?,?,?,?) `;

export const REMOVECONDUCTOR = ` DELETE FROM conductores `;

export const GETCONDUCTOR = ` SELECT nombre, apellido, codigo, createdAt
    FROM conductores 
    ORDER BY nombre DESC`;
/** */

/**traslados */
export const CREATETABLETRASLADO = `CREATE TABLE IF NOT EXISTS traslados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioEnviaId TEXT NOT NULL,
    usuarioRecibeId TEXT NULL,
    conductorId  INTEGER NOT NULL REFERENCES conductores(codigo) ON DELETE NO ACTION,
    fecha  TEXT NULL,
    fechaEntrega  TEXT NULL,
    codInterno INTEGER NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    bodegaOrigenId  INTEGER NOT NULL REFERENCES bodegas(codigo) ON DELETE NO ACTION,
    bodegaDestinoId  INTEGER NOT NULL REFERENCES bodegas(codigo) ON DELETE NO ACTION,
    estado TEXT not null,
    created TEXT not null,
    placa TEXT NOT NULL
    )`;

export const REMOVETABLETRASLADO = `DROP TABLE IF EXISTS traslados `;
export const SAVETRASLADO = `INSERT INTO traslados (usuarioEnviaId, conductorId, fecha, createdAt,
     bodegaOrigenId, bodegaDestinoId, estado, created) 
        VALUES (?,?,?,?, ?, ?, ?, ?) `;
export const SAVETRASLADOENTREGA = `INSERT INTO traslados (codInterno, usuarioEnviaId, conductorId,
     fecha, createdAt, bodegaOrigenId, bodegaDestinoId, estado, created, placa) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;

export const UPDATETRASLADO = `UPDATE traslados SET conductorId = ?, fecha = ?, bodegaDestinoId = ?, placa = ?
                                WHERE id = ? and created = ?`;
export const UPDATETRASLADOLOCAL = `UPDATE traslados SET codInterno = ?, usuarioEnviaId = ?, conductorId = ?, fecha = ?, bodegaDestinoId = ?, bodegaOrigenId = ?
                                WHERE id = ? and created = ? and estado = ?`;

export const UPDATETRASLADORECEPCION = `UPDATE traslados SET usuarioRecibeId = ?, fechaEntrega = ?
                                WHERE id = ? and created = ? and estado = ?`;

export const UPDATETRASLADOAPI = `UPDATE traslados SET codInterno = ?
                                WHERE id = ? and created = ?`;

export const REMOVETRASLADOS = ` DELETE FROM traslados  `;
export const REMOVETRASLADO = ` DELETE FROM traslados WHERE id = ? `;

export const GETTRASLADOS = ` SELECT id, usuarioEnviaId, usuarioRecibeId, conductorId, fecha, createdAt, bodegaOrigenId bodegaOrigen, bodegaDestinoId bodegaDestino
        FROM traslados
        WHERE strftime('%Y-%m-%d', fecha) = ? AND id = ?
        ORDER BY id DESC 
        LIMIT 1 `;

export const COUNTTRASLADOS = `SELECT fecha, COUNT(*) traslados, sum(state) state
        FROM (
              SELECT fecha, id, sum(state) state FROM (
                SELECT strftime('%Y-%m-%d', a.createdAt) fecha, a.id, case when codInterno is null THEN 0 ELSE 1 END state
                FROM traslados a
                WHERE strftime('%Y-%m-%d', a.createdAt) BETWEEN ? AND ? AND created = ? AND estado NOT IN('LOCAL')
                GROUP BY strftime('%Y-%m-%d', a.createdAt), a.id
                
              ) data
              GROUP BY fecha, id
            ) dt
        GROUP BY fecha          
        ORDER BY fecha DESC `;

export const GETTRASLADO = ` SELECT a.id, a.codInterno, a.usuarioEnviaId, a.usuarioRecibeId, a.conductorId, 
(b.nombre ||' '||b.apellido) nomConductor, a.fecha, a.createdAt, 
bodegaOrigenId bodegaOrigen, bodegaDestinoId bodegaDestino, c.nombre nomBodegaDestino, d.nombre nomBodegaOrigen, a.placa
        FROM traslados a 
        LEFT JOIN conductores b ON b.codigo = a.conductorId 
        LEFT JOIN bodegas c ON c.codigo = a.bodegaDestinoId
        LEFT JOIN bodegas d ON d.codigo = a.bodegaOrigenId
        WHERE id = ?
        ORDER BY id DESC `;

export const GETTRASLADOCOD = ` SELECT id, codInterno, usuarioEnviaId, usuarioRecibeId, conductorId, fecha, createdAt, 
        bodegaOrigenId bodegaOrigen, bodegaDestinoId bodegaDestino
                FROM traslados
                WHERE codInterno = ? AND created = ? AND estado = ?
                ORDER BY id DESC 
                LIMIT 1`;
/** */

/**detalle traslados */
export const CREATETABLEDETALLETRASLADO = `CREATE TABLE IF NOT EXISTS detalletraslados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trasladoId TEXT NOT NULL,
    productoId TEXT NOT NULL,
    cantidad  integer NOT NULL,
    cantidadRecibida integer NOT NULL,
    centroCosto TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    unidad   INTEGER )`;

export const REMOVETABLEDETALLETRASLADO = `DROP TABLE IF EXISTS detalletraslados `;
export const SAVEDETALLETRASLADO = `INSERT INTO detalletraslados (trasladoId, productoId, centroCosto, cantidad, cantidadRecibida, createdAt, unidad) 
        VALUES (?,?,?,?,?,?,?) `;

export const REMOVEDETALLETRASLADOS = ` DELETE FROM detalletraslados  `;
export const REMOVEDETALLETRASLADO = ` DELETE FROM detalletraslados WHERE trasladoId = ? `;

export const GETDETALLETRASLADO = ` SELECT a.id, a.trasladoId, a.productoId codigoInterno, a.centroCosto, a.cantidad, a.cantidadRecibida, a.createdAt, b.codigo unidad, b.nombre nombreUnidad, c.nombre
        FROM detalletraslados a LEFT JOIN unidades b ON a.unidad = b.codigo
        LEFT JOIN productos c ON c.codigoInterno = a.productoId
        WHERE  trasladoId = ?
        ORDER BY id DESC  `;

/** */

/**unidades */
export const CREATETABLEUNIDADES = `CREATE TABLE IF NOT EXISTS unidades (
    nombre TEXT NOT NULL,
    codigo  INTEGER NOT NULL PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLEUNIDADES = `DROP TABLE IF EXISTS unidades`;
export const SAVEUNIDAD = `INSERT INTO unidades (nombre, codigo, createdAt) 
    VALUES (?,?,?)`;

export const REMOVEUNIDADES = ` DELETE FROM unidades `;

export const GETUNIDADES = ` SELECT nombre, codigo, createdAt
    FROM unidades 
    ORDER BY nombre DESC `;

export const SAVEUNIDADES = `INSERT  INTO unidades(codigo, nombre, createdAt) values`;
/** */

/**color */
export const CREATETABLECOLOR = `CREATE TABLE IF NOT EXISTS colores (
    nombre TEXT NOT NULL,
    codigo  INTEGER NOT NULL PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLECOLOR = `DROP TABLE IF EXISTS colores`;
export const SAVECOLOR = `INSERT INTO colores (nombre, codigo, createdAt) 
    VALUES (?,?,?)`;

export const REMOVECOLOR = ` DELETE FROM colores `;

export const GETCOLOR = ` SELECT nombre, codigo, createdAt
    FROM colores 
    ORDER BY nombre DESC `;

export const SAVECOLORES = `INSERT  INTO colores(codigo, nombre, createdAt) values`;
/** */

/**marca */
export const CREATETABLEMARCA = `CREATE TABLE IF NOT EXISTS marcas (
    nombre TEXT NOT NULL,
    codigo  INTEGER NOT NULL PRIMARY KEY,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`;

export const REMOVETABLEMARCA = `DROP TABLE IF EXISTS marcas`;
export const SAVEMARCA = `INSERT INTO marcas (nombre, codigo, createdAt) 
    VALUES (?,?,?)`;

export const REMOVEMARCA = ` DELETE FROM marcas `;

export const GETMARCA = ` SELECT nombre, codigo, createdAt
    FROM marcas 
    ORDER BY nombre DESC `;

export const SAVEMARCAS = `INSERT  INTO marcas(codigo, nombre, createdAt) values`;
/** */
