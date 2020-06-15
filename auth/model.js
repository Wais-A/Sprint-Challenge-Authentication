const db = require('../database/dbConfig')
module.exports = {
 add,
 findById,
 findBy
}

async function add ( user )
{
 // eslint-disable-next-line no-useless-catch
 try
 {
  const [ id ] = await db( 'users' ).insert( user, 'id' );

  return findById( id );
 } catch ( error )
 {
  throw error;
 }
}

function findById ( id )
{
 return db( 'users' ).where( { id } ).first();
}

function findBy ( filter )
{
 return db( 'users' ).where( filter ).orderBy( 'id' );
}