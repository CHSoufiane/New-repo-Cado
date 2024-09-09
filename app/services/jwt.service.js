import jwt from 'jsonwebtoken';

//let refreshTokens = {};

export default {

  async setCache(cache){
    this.cache = cache;
  },

  // Le but est de renvoyer un objet qui contient le token et sa date d'expiration
  async generateToken(data, generateRefresh = false){
    const mainTokenExp = Math.round(Date.now() / 1000 + 20);
    const refreshTokenTTL = 60 * 60;
    const refreshTokenExp = Math.round((Date.now() / 1000) + refreshTokenTTL);
    //JWT_PRIVATE_KEY
    const mainToken = jwt.sign(
      {exp: mainTokenExp, data},
      process.env.JWT_PRIVATE_KEY
    );

    if(generateRefresh){
      const refreshToken = jwt.sign(
        {exp: refreshTokenExp, data: {id: data.id}},
        process.env.JWT_PRIVATE_KEY
      );

      // On stocke les données de l'access token dans la bdd rapide de stockage de refresh
      await this.cache.set(
        `refresh:${data.id}`,
        data,
        {ttl: refreshTokenTTL}
      );
      return {
        mainToken: {
          token: mainToken,
          exp: mainTokenExp
        },
        refreshToken: {
          token: refreshToken,
          exp: refreshTokenExp
        },
        
      }
    }

    return {
      mainToken: {
        token: mainToken,
        exp: mainTokenExp
      },
    }
  },

  async getFromRefresh(refreshToken){
    try{
      const data = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY);
      const refreshToken = await this.cache.get(`refresh:${data.id}`);
      if(!refreshToken){
        throw new Error('');
      }
    }catch(err){
      throw new console.error('Refresh token invalid');
          }
        }
      });
    }
  },

  // Le but de cette méthode est de renvoyer les infos du token si celui-ci a été fourni dans la requête. En le vérifiant. Et ici cette méthode sera appelé dans le context afin de conserver les infos pour les resolvers.
  verifyToken(bearer, fingerprint){
    if(!bearer){
      // S'il n'y a pas de token, c'est pour potentiellement accéder aun page que n'en nécessite pas, donc je ne renvoi pas d'erreur, je me contente de ne pas renvoyer d'infos du token
      return null;
    }
    const [, token] = bearer.split(' ');

    if(!token){
      return null;
    }

    try{
      const tokenInfos = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      
      // Vérification de l'empreinte de la requête
      if(fingerprint.ip !== tokenInfos.data.fingerprint.ip || fingerprint.userAgent !== tokenInfos.data.fingerprint.userAgent){
        throw new Error('');
      }

      return tokenInfos;
    }catch(err){
      throw new GraphQLError('Authentication', {
        extensions: {
          code: 'AUTHENTICATION_FAILED',
          http: {
            status: 400
          }
        }
      });
    }
  }

}