
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model Note
 * 
 */
export type Note = $Result.DefaultSelection<Prisma.$NotePayload>
/**
 * Model Progress
 * 
 */
export type Progress = $Result.DefaultSelection<Prisma.$ProgressPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model Embedding
 * 
 */
export type Embedding = $Result.DefaultSelection<Prisma.$EmbeddingPayload>
/**
 * Model RetrievalLog
 * 
 */
export type RetrievalLog = $Result.DefaultSelection<Prisma.$RetrievalLogPayload>
/**
 * Model Topic
 * 
 */
export type Topic = $Result.DefaultSelection<Prisma.$TopicPayload>
/**
 * Model TopicInteraction
 * 
 */
export type TopicInteraction = $Result.DefaultSelection<Prisma.$TopicInteractionPayload>
/**
 * Model TopicMastery
 * 
 */
export type TopicMastery = $Result.DefaultSelection<Prisma.$TopicMasteryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const DocumentStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]


export const MasteryStatus: {
  NOT_STARTED: 'NOT_STARTED',
  BEGINNER: 'BEGINNER',
  LEARNING: 'LEARNING',
  PROFICIENT: 'PROFICIENT',
  MASTERED: 'MASTERED'
};

export type MasteryStatus = (typeof MasteryStatus)[keyof typeof MasteryStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type DocumentStatus = $Enums.DocumentStatus

export const DocumentStatus: typeof $Enums.DocumentStatus

export type MasteryStatus = $Enums.MasteryStatus

export const MasteryStatus: typeof $Enums.MasteryStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs>;

  /**
   * `prisma.note`: Exposes CRUD operations for the **Note** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notes
    * const notes = await prisma.note.findMany()
    * ```
    */
  get note(): Prisma.NoteDelegate<ExtArgs>;

  /**
   * `prisma.progress`: Exposes CRUD operations for the **Progress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Progresses
    * const progresses = await prisma.progress.findMany()
    * ```
    */
  get progress(): Prisma.ProgressDelegate<ExtArgs>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs>;

  /**
   * `prisma.embedding`: Exposes CRUD operations for the **Embedding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Embeddings
    * const embeddings = await prisma.embedding.findMany()
    * ```
    */
  get embedding(): Prisma.EmbeddingDelegate<ExtArgs>;

  /**
   * `prisma.retrievalLog`: Exposes CRUD operations for the **RetrievalLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RetrievalLogs
    * const retrievalLogs = await prisma.retrievalLog.findMany()
    * ```
    */
  get retrievalLog(): Prisma.RetrievalLogDelegate<ExtArgs>;

  /**
   * `prisma.topic`: Exposes CRUD operations for the **Topic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Topics
    * const topics = await prisma.topic.findMany()
    * ```
    */
  get topic(): Prisma.TopicDelegate<ExtArgs>;

  /**
   * `prisma.topicInteraction`: Exposes CRUD operations for the **TopicInteraction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicInteractions
    * const topicInteractions = await prisma.topicInteraction.findMany()
    * ```
    */
  get topicInteraction(): Prisma.TopicInteractionDelegate<ExtArgs>;

  /**
   * `prisma.topicMastery`: Exposes CRUD operations for the **TopicMastery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicMasteries
    * const topicMasteries = await prisma.topicMastery.findMany()
    * ```
    */
  get topicMastery(): Prisma.TopicMasteryDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    RefreshToken: 'RefreshToken',
    Note: 'Note',
    Progress: 'Progress',
    Document: 'Document',
    Embedding: 'Embedding',
    RetrievalLog: 'RetrievalLog',
    Topic: 'Topic',
    TopicInteraction: 'TopicInteraction',
    TopicMastery: 'TopicMastery'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "refreshToken" | "note" | "progress" | "document" | "embedding" | "retrievalLog" | "topic" | "topicInteraction" | "topicMastery"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      Note: {
        payload: Prisma.$NotePayload<ExtArgs>
        fields: Prisma.NoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findFirst: {
            args: Prisma.NoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findMany: {
            args: Prisma.NoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          create: {
            args: Prisma.NoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          createMany: {
            args: Prisma.NoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          delete: {
            args: Prisma.NoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          update: {
            args: Prisma.NoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          deleteMany: {
            args: Prisma.NoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          aggregate: {
            args: Prisma.NoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNote>
          }
          groupBy: {
            args: Prisma.NoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<NoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.NoteCountArgs<ExtArgs>
            result: $Utils.Optional<NoteCountAggregateOutputType> | number
          }
        }
      }
      Progress: {
        payload: Prisma.$ProgressPayload<ExtArgs>
        fields: Prisma.ProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findFirst: {
            args: Prisma.ProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          findMany: {
            args: Prisma.ProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          create: {
            args: Prisma.ProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          createMany: {
            args: Prisma.ProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>[]
          }
          delete: {
            args: Prisma.ProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          update: {
            args: Prisma.ProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          deleteMany: {
            args: Prisma.ProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgressPayload>
          }
          aggregate: {
            args: Prisma.ProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgress>
          }
          groupBy: {
            args: Prisma.ProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgressCountArgs<ExtArgs>
            result: $Utils.Optional<ProgressCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      Embedding: {
        payload: Prisma.$EmbeddingPayload<ExtArgs>
        fields: Prisma.EmbeddingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmbeddingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmbeddingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          findFirst: {
            args: Prisma.EmbeddingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmbeddingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          findMany: {
            args: Prisma.EmbeddingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>[]
          }
          create: {
            args: Prisma.EmbeddingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          createMany: {
            args: Prisma.EmbeddingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmbeddingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>[]
          }
          delete: {
            args: Prisma.EmbeddingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          update: {
            args: Prisma.EmbeddingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          deleteMany: {
            args: Prisma.EmbeddingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmbeddingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmbeddingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmbeddingPayload>
          }
          aggregate: {
            args: Prisma.EmbeddingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmbedding>
          }
          groupBy: {
            args: Prisma.EmbeddingGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmbeddingGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmbeddingCountArgs<ExtArgs>
            result: $Utils.Optional<EmbeddingCountAggregateOutputType> | number
          }
        }
      }
      RetrievalLog: {
        payload: Prisma.$RetrievalLogPayload<ExtArgs>
        fields: Prisma.RetrievalLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RetrievalLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RetrievalLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          findFirst: {
            args: Prisma.RetrievalLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RetrievalLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          findMany: {
            args: Prisma.RetrievalLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>[]
          }
          create: {
            args: Prisma.RetrievalLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          createMany: {
            args: Prisma.RetrievalLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RetrievalLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>[]
          }
          delete: {
            args: Prisma.RetrievalLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          update: {
            args: Prisma.RetrievalLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          deleteMany: {
            args: Prisma.RetrievalLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RetrievalLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RetrievalLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RetrievalLogPayload>
          }
          aggregate: {
            args: Prisma.RetrievalLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRetrievalLog>
          }
          groupBy: {
            args: Prisma.RetrievalLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<RetrievalLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.RetrievalLogCountArgs<ExtArgs>
            result: $Utils.Optional<RetrievalLogCountAggregateOutputType> | number
          }
        }
      }
      Topic: {
        payload: Prisma.$TopicPayload<ExtArgs>
        fields: Prisma.TopicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findFirst: {
            args: Prisma.TopicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findMany: {
            args: Prisma.TopicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          create: {
            args: Prisma.TopicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          createMany: {
            args: Prisma.TopicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          delete: {
            args: Prisma.TopicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          update: {
            args: Prisma.TopicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          deleteMany: {
            args: Prisma.TopicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TopicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          aggregate: {
            args: Prisma.TopicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopic>
          }
          groupBy: {
            args: Prisma.TopicGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicCountArgs<ExtArgs>
            result: $Utils.Optional<TopicCountAggregateOutputType> | number
          }
        }
      }
      TopicInteraction: {
        payload: Prisma.$TopicInteractionPayload<ExtArgs>
        fields: Prisma.TopicInteractionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicInteractionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicInteractionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload>
          }
          findFirst: {
            args: Prisma.TopicInteractionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicInteractionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload>
          }
          findMany: {
            args: Prisma.TopicInteractionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload>[]
          }
          delete: {
            args: Prisma.TopicInteractionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload>
          }
          update: {
            args: Prisma.TopicInteractionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicInteractionPayload>
          }
          deleteMany: {
            args: Prisma.TopicInteractionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicInteractionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          aggregate: {
            args: Prisma.TopicInteractionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicInteraction>
          }
          groupBy: {
            args: Prisma.TopicInteractionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicInteractionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicInteractionCountArgs<ExtArgs>
            result: $Utils.Optional<TopicInteractionCountAggregateOutputType> | number
          }
        }
      }
      TopicMastery: {
        payload: Prisma.$TopicMasteryPayload<ExtArgs>
        fields: Prisma.TopicMasteryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicMasteryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicMasteryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          findFirst: {
            args: Prisma.TopicMasteryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicMasteryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          findMany: {
            args: Prisma.TopicMasteryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>[]
          }
          create: {
            args: Prisma.TopicMasteryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          createMany: {
            args: Prisma.TopicMasteryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicMasteryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>[]
          }
          delete: {
            args: Prisma.TopicMasteryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          update: {
            args: Prisma.TopicMasteryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          deleteMany: {
            args: Prisma.TopicMasteryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicMasteryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TopicMasteryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicMasteryPayload>
          }
          aggregate: {
            args: Prisma.TopicMasteryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicMastery>
          }
          groupBy: {
            args: Prisma.TopicMasteryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicMasteryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicMasteryCountArgs<ExtArgs>
            result: $Utils.Optional<TopicMasteryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    notes: number
    progress: number
    documents: number
    embeddings: number
    refreshTokens: number
    topicInteractions: number
    topicMasteries: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notes?: boolean | UserCountOutputTypeCountNotesArgs
    progress?: boolean | UserCountOutputTypeCountProgressArgs
    documents?: boolean | UserCountOutputTypeCountDocumentsArgs
    embeddings?: boolean | UserCountOutputTypeCountEmbeddingsArgs
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
    topicInteractions?: boolean | UserCountOutputTypeCountTopicInteractionsArgs
    topicMasteries?: boolean | UserCountOutputTypeCountTopicMasteriesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEmbeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmbeddingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTopicInteractionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicInteractionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTopicMasteriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicMasteryWhereInput
  }


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    embeddings: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    embeddings?: boolean | DocumentCountOutputTypeCountEmbeddingsArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountEmbeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmbeddingWhereInput
  }


  /**
   * Count Type TopicCountOutputType
   */

  export type TopicCountOutputType = {
    children: number
    interactions: number
    masteries: number
  }

  export type TopicCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    children?: boolean | TopicCountOutputTypeCountChildrenArgs
    interactions?: boolean | TopicCountOutputTypeCountInteractionsArgs
    masteries?: boolean | TopicCountOutputTypeCountMasteriesArgs
  }

  // Custom InputTypes
  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCountOutputType
     */
    select?: TopicCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountChildrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountInteractionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicInteractionWhereInput
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountMasteriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicMasteryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedLogins: number | null
  }

  export type UserSumAggregateOutputType = {
    failedLogins: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    isVerified: boolean | null
    failedLogins: number | null
    lockedUntil: Date | null
    verificationToken: string | null
    verificationExpires: Date | null
    resetToken: string | null
    resetTokenExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    isVerified: boolean | null
    failedLogins: number | null
    lockedUntil: Date | null
    verificationToken: string | null
    verificationExpires: Date | null
    resetToken: string | null
    resetTokenExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    role: number
    isVerified: number
    failedLogins: number
    lockedUntil: number
    verificationToken: number
    verificationExpires: number
    resetToken: number
    resetTokenExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedLogins?: true
  }

  export type UserSumAggregateInputType = {
    failedLogins?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    isVerified?: true
    failedLogins?: true
    lockedUntil?: true
    verificationToken?: true
    verificationExpires?: true
    resetToken?: true
    resetTokenExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    isVerified?: true
    failedLogins?: true
    lockedUntil?: true
    verificationToken?: true
    verificationExpires?: true
    resetToken?: true
    resetTokenExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    isVerified?: true
    failedLogins?: true
    lockedUntil?: true
    verificationToken?: true
    verificationExpires?: true
    resetToken?: true
    resetTokenExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    role: $Enums.Role
    isVerified: boolean
    failedLogins: number
    lockedUntil: Date | null
    verificationToken: string | null
    verificationExpires: Date | null
    resetToken: string | null
    resetTokenExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    isVerified?: boolean
    failedLogins?: boolean
    lockedUntil?: boolean
    verificationToken?: boolean
    verificationExpires?: boolean
    resetToken?: boolean
    resetTokenExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    notes?: boolean | User$notesArgs<ExtArgs>
    progress?: boolean | User$progressArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    embeddings?: boolean | User$embeddingsArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    topicInteractions?: boolean | User$topicInteractionsArgs<ExtArgs>
    topicMasteries?: boolean | User$topicMasteriesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    isVerified?: boolean
    failedLogins?: boolean
    lockedUntil?: boolean
    verificationToken?: boolean
    verificationExpires?: boolean
    resetToken?: boolean
    resetTokenExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    isVerified?: boolean
    failedLogins?: boolean
    lockedUntil?: boolean
    verificationToken?: boolean
    verificationExpires?: boolean
    resetToken?: boolean
    resetTokenExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notes?: boolean | User$notesArgs<ExtArgs>
    progress?: boolean | User$progressArgs<ExtArgs>
    documents?: boolean | User$documentsArgs<ExtArgs>
    embeddings?: boolean | User$embeddingsArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    topicInteractions?: boolean | User$topicInteractionsArgs<ExtArgs>
    topicMasteries?: boolean | User$topicMasteriesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      notes: Prisma.$NotePayload<ExtArgs>[]
      progress: Prisma.$ProgressPayload<ExtArgs>[]
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      embeddings: Prisma.$EmbeddingPayload<ExtArgs>[]
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
      topicInteractions: Prisma.$TopicInteractionPayload<ExtArgs>[]
      topicMasteries: Prisma.$TopicMasteryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      role: $Enums.Role
      isVerified: boolean
      failedLogins: number
      lockedUntil: Date | null
      verificationToken: string | null
      verificationExpires: Date | null
      resetToken: string | null
      resetTokenExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notes<T extends User$notesArgs<ExtArgs> = {}>(args?: Subset<T, User$notesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany"> | Null>
    progress<T extends User$progressArgs<ExtArgs> = {}>(args?: Subset<T, User$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findMany"> | Null>
    documents<T extends User$documentsArgs<ExtArgs> = {}>(args?: Subset<T, User$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany"> | Null>
    embeddings<T extends User$embeddingsArgs<ExtArgs> = {}>(args?: Subset<T, User$embeddingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findMany"> | Null>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany"> | Null>
    topicInteractions<T extends User$topicInteractionsArgs<ExtArgs> = {}>(args?: Subset<T, User$topicInteractionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findMany"> | Null>
    topicMasteries<T extends User$topicMasteriesArgs<ExtArgs> = {}>(args?: Subset<T, User$topicMasteriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly isVerified: FieldRef<"User", 'Boolean'>
    readonly failedLogins: FieldRef<"User", 'Int'>
    readonly lockedUntil: FieldRef<"User", 'DateTime'>
    readonly verificationToken: FieldRef<"User", 'String'>
    readonly verificationExpires: FieldRef<"User", 'DateTime'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.notes
   */
  export type User$notesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    cursor?: NoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * User.progress
   */
  export type User$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    where?: ProgressWhereInput
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    cursor?: ProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * User.documents
   */
  export type User$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.embeddings
   */
  export type User$embeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    where?: EmbeddingWhereInput
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    cursor?: EmbeddingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmbeddingScalarFieldEnum | EmbeddingScalarFieldEnum[]
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User.topicInteractions
   */
  export type User$topicInteractionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    where?: TopicInteractionWhereInput
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    cursor?: TopicInteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicInteractionScalarFieldEnum | TopicInteractionScalarFieldEnum[]
  }

  /**
   * User.topicMasteries
   */
  export type User$topicMasteriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    where?: TopicMasteryWhereInput
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    cursor?: TopicMasteryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicMasteryScalarFieldEnum | TopicMasteryScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    userId: string
    token: string
    expiresAt: Date
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */ 
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly token: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model Note
   */

  export type AggregateNote = {
    _count: NoteCountAggregateOutputType | null
    _avg: NoteAvgAggregateOutputType | null
    _sum: NoteSumAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  export type NoteAvgAggregateOutputType = {
    page: number | null
  }

  export type NoteSumAggregateOutputType = {
    page: number | null
  }

  export type NoteMinAggregateOutputType = {
    id: string | null
    userId: string | null
    document: string | null
    page: number | null
    content: string | null
    createdAt: Date | null
  }

  export type NoteMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    document: string | null
    page: number | null
    content: string | null
    createdAt: Date | null
  }

  export type NoteCountAggregateOutputType = {
    id: number
    userId: number
    document: number
    page: number
    content: number
    createdAt: number
    _all: number
  }


  export type NoteAvgAggregateInputType = {
    page?: true
  }

  export type NoteSumAggregateInputType = {
    page?: true
  }

  export type NoteMinAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    page?: true
    content?: true
    createdAt?: true
  }

  export type NoteMaxAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    page?: true
    content?: true
    createdAt?: true
  }

  export type NoteCountAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    page?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type NoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Note to aggregate.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notes
    **/
    _count?: true | NoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NoteMaxAggregateInputType
  }

  export type GetNoteAggregateType<T extends NoteAggregateArgs> = {
        [P in keyof T & keyof AggregateNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNote[P]>
      : GetScalarType<T[P], AggregateNote[P]>
  }




  export type NoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithAggregationInput | NoteOrderByWithAggregationInput[]
    by: NoteScalarFieldEnum[] | NoteScalarFieldEnum
    having?: NoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NoteCountAggregateInputType | true
    _avg?: NoteAvgAggregateInputType
    _sum?: NoteSumAggregateInputType
    _min?: NoteMinAggregateInputType
    _max?: NoteMaxAggregateInputType
  }

  export type NoteGroupByOutputType = {
    id: string
    userId: string
    document: string
    page: number
    content: string
    createdAt: Date
    _count: NoteCountAggregateOutputType | null
    _avg: NoteAvgAggregateOutputType | null
    _sum: NoteSumAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  type GetNoteGroupByPayload<T extends NoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NoteGroupByOutputType[P]>
            : GetScalarType<T[P], NoteGroupByOutputType[P]>
        }
      >
    >


  export type NoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    document?: boolean
    page?: boolean
    content?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    document?: boolean
    page?: boolean
    content?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectScalar = {
    id?: boolean
    userId?: boolean
    document?: boolean
    page?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type NoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Note"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      document: string
      page: number
      content: string
      createdAt: Date
    }, ExtArgs["result"]["note"]>
    composites: {}
  }

  type NoteGetPayload<S extends boolean | null | undefined | NoteDefaultArgs> = $Result.GetResult<Prisma.$NotePayload, S>

  type NoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NoteCountAggregateInputType | true
    }

  export interface NoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Note'], meta: { name: 'Note' } }
    /**
     * Find zero or one Note that matches the filter.
     * @param {NoteFindUniqueArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NoteFindUniqueArgs>(args: SelectSubset<T, NoteFindUniqueArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Note that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NoteFindUniqueOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NoteFindUniqueOrThrowArgs>(args: SelectSubset<T, NoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Note that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NoteFindFirstArgs>(args?: SelectSubset<T, NoteFindFirstArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Note that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NoteFindFirstOrThrowArgs>(args?: SelectSubset<T, NoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notes
     * const notes = await prisma.note.findMany()
     * 
     * // Get first 10 Notes
     * const notes = await prisma.note.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const noteWithIdOnly = await prisma.note.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NoteFindManyArgs>(args?: SelectSubset<T, NoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Note.
     * @param {NoteCreateArgs} args - Arguments to create a Note.
     * @example
     * // Create one Note
     * const Note = await prisma.note.create({
     *   data: {
     *     // ... data to create a Note
     *   }
     * })
     * 
     */
    create<T extends NoteCreateArgs>(args: SelectSubset<T, NoteCreateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notes.
     * @param {NoteCreateManyArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NoteCreateManyArgs>(args?: SelectSubset<T, NoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notes and returns the data saved in the database.
     * @param {NoteCreateManyAndReturnArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notes and only return the `id`
     * const noteWithIdOnly = await prisma.note.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NoteCreateManyAndReturnArgs>(args?: SelectSubset<T, NoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Note.
     * @param {NoteDeleteArgs} args - Arguments to delete one Note.
     * @example
     * // Delete one Note
     * const Note = await prisma.note.delete({
     *   where: {
     *     // ... filter to delete one Note
     *   }
     * })
     * 
     */
    delete<T extends NoteDeleteArgs>(args: SelectSubset<T, NoteDeleteArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Note.
     * @param {NoteUpdateArgs} args - Arguments to update one Note.
     * @example
     * // Update one Note
     * const note = await prisma.note.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NoteUpdateArgs>(args: SelectSubset<T, NoteUpdateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notes.
     * @param {NoteDeleteManyArgs} args - Arguments to filter Notes to delete.
     * @example
     * // Delete a few Notes
     * const { count } = await prisma.note.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NoteDeleteManyArgs>(args?: SelectSubset<T, NoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notes
     * const note = await prisma.note.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NoteUpdateManyArgs>(args: SelectSubset<T, NoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Note.
     * @param {NoteUpsertArgs} args - Arguments to update or create a Note.
     * @example
     * // Update or create a Note
     * const note = await prisma.note.upsert({
     *   create: {
     *     // ... data to create a Note
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Note we want to update
     *   }
     * })
     */
    upsert<T extends NoteUpsertArgs>(args: SelectSubset<T, NoteUpsertArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteCountArgs} args - Arguments to filter Notes to count.
     * @example
     * // Count the number of Notes
     * const count = await prisma.note.count({
     *   where: {
     *     // ... the filter for the Notes we want to count
     *   }
     * })
    **/
    count<T extends NoteCountArgs>(
      args?: Subset<T, NoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NoteAggregateArgs>(args: Subset<T, NoteAggregateArgs>): Prisma.PrismaPromise<GetNoteAggregateType<T>>

    /**
     * Group by Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NoteGroupByArgs['orderBy'] }
        : { orderBy?: NoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Note model
   */
  readonly fields: NoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Note.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Note model
   */ 
  interface NoteFieldRefs {
    readonly id: FieldRef<"Note", 'String'>
    readonly userId: FieldRef<"Note", 'String'>
    readonly document: FieldRef<"Note", 'String'>
    readonly page: FieldRef<"Note", 'Int'>
    readonly content: FieldRef<"Note", 'String'>
    readonly createdAt: FieldRef<"Note", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Note findUnique
   */
  export type NoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findUniqueOrThrow
   */
  export type NoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findFirst
   */
  export type NoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findFirstOrThrow
   */
  export type NoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findMany
   */
  export type NoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Notes to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note create
   */
  export type NoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Note.
     */
    data: XOR<NoteCreateInput, NoteUncheckedCreateInput>
  }

  /**
   * Note createMany
   */
  export type NoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Note createManyAndReturn
   */
  export type NoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Note update
   */
  export type NoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Note.
     */
    data: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
    /**
     * Choose, which Note to update.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note updateMany
   */
  export type NoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notes.
     */
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyInput>
    /**
     * Filter which Notes to update
     */
    where?: NoteWhereInput
  }

  /**
   * Note upsert
   */
  export type NoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Note to update in case it exists.
     */
    where: NoteWhereUniqueInput
    /**
     * In case the Note found by the `where` argument doesn't exist, create a new Note with this data.
     */
    create: XOR<NoteCreateInput, NoteUncheckedCreateInput>
    /**
     * In case the Note was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
  }

  /**
   * Note delete
   */
  export type NoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter which Note to delete.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note deleteMany
   */
  export type NoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notes to delete
     */
    where?: NoteWhereInput
  }

  /**
   * Note without action
   */
  export type NoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
  }


  /**
   * Model Progress
   */

  export type AggregateProgress = {
    _count: ProgressCountAggregateOutputType | null
    _avg: ProgressAvgAggregateOutputType | null
    _sum: ProgressSumAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  export type ProgressAvgAggregateOutputType = {
    pagesRead: number | null
    minutes: number | null
  }

  export type ProgressSumAggregateOutputType = {
    pagesRead: number | null
    minutes: number | null
  }

  export type ProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    document: string | null
    pagesRead: number | null
    minutes: number | null
    date: Date | null
  }

  export type ProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    document: string | null
    pagesRead: number | null
    minutes: number | null
    date: Date | null
  }

  export type ProgressCountAggregateOutputType = {
    id: number
    userId: number
    document: number
    pagesRead: number
    minutes: number
    date: number
    _all: number
  }


  export type ProgressAvgAggregateInputType = {
    pagesRead?: true
    minutes?: true
  }

  export type ProgressSumAggregateInputType = {
    pagesRead?: true
    minutes?: true
  }

  export type ProgressMinAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    pagesRead?: true
    minutes?: true
    date?: true
  }

  export type ProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    pagesRead?: true
    minutes?: true
    date?: true
  }

  export type ProgressCountAggregateInputType = {
    id?: true
    userId?: true
    document?: true
    pagesRead?: true
    minutes?: true
    date?: true
    _all?: true
  }

  export type ProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progress to aggregate.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Progresses
    **/
    _count?: true | ProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgressMaxAggregateInputType
  }

  export type GetProgressAggregateType<T extends ProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgress[P]>
      : GetScalarType<T[P], AggregateProgress[P]>
  }




  export type ProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgressWhereInput
    orderBy?: ProgressOrderByWithAggregationInput | ProgressOrderByWithAggregationInput[]
    by: ProgressScalarFieldEnum[] | ProgressScalarFieldEnum
    having?: ProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgressCountAggregateInputType | true
    _avg?: ProgressAvgAggregateInputType
    _sum?: ProgressSumAggregateInputType
    _min?: ProgressMinAggregateInputType
    _max?: ProgressMaxAggregateInputType
  }

  export type ProgressGroupByOutputType = {
    id: string
    userId: string
    document: string
    pagesRead: number
    minutes: number
    date: Date
    _count: ProgressCountAggregateOutputType | null
    _avg: ProgressAvgAggregateOutputType | null
    _sum: ProgressSumAggregateOutputType | null
    _min: ProgressMinAggregateOutputType | null
    _max: ProgressMaxAggregateOutputType | null
  }

  type GetProgressGroupByPayload<T extends ProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgressGroupByOutputType[P]>
            : GetScalarType<T[P], ProgressGroupByOutputType[P]>
        }
      >
    >


  export type ProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    document?: boolean
    pagesRead?: boolean
    minutes?: boolean
    date?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    document?: boolean
    pagesRead?: boolean
    minutes?: boolean
    date?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["progress"]>

  export type ProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    document?: boolean
    pagesRead?: boolean
    minutes?: boolean
    date?: boolean
  }

  export type ProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Progress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      document: string
      pagesRead: number
      minutes: number
      date: Date
    }, ExtArgs["result"]["progress"]>
    composites: {}
  }

  type ProgressGetPayload<S extends boolean | null | undefined | ProgressDefaultArgs> = $Result.GetResult<Prisma.$ProgressPayload, S>

  type ProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProgressFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProgressCountAggregateInputType | true
    }

  export interface ProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Progress'], meta: { name: 'Progress' } }
    /**
     * Find zero or one Progress that matches the filter.
     * @param {ProgressFindUniqueArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgressFindUniqueArgs>(args: SelectSubset<T, ProgressFindUniqueArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Progress that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProgressFindUniqueOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Progress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgressFindFirstArgs>(args?: SelectSubset<T, ProgressFindFirstArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Progress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindFirstOrThrowArgs} args - Arguments to find a Progress
     * @example
     * // Get one Progress
     * const progress = await prisma.progress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Progresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Progresses
     * const progresses = await prisma.progress.findMany()
     * 
     * // Get first 10 Progresses
     * const progresses = await prisma.progress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const progressWithIdOnly = await prisma.progress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgressFindManyArgs>(args?: SelectSubset<T, ProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Progress.
     * @param {ProgressCreateArgs} args - Arguments to create a Progress.
     * @example
     * // Create one Progress
     * const Progress = await prisma.progress.create({
     *   data: {
     *     // ... data to create a Progress
     *   }
     * })
     * 
     */
    create<T extends ProgressCreateArgs>(args: SelectSubset<T, ProgressCreateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Progresses.
     * @param {ProgressCreateManyArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgressCreateManyArgs>(args?: SelectSubset<T, ProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Progresses and returns the data saved in the database.
     * @param {ProgressCreateManyAndReturnArgs} args - Arguments to create many Progresses.
     * @example
     * // Create many Progresses
     * const progress = await prisma.progress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Progresses and only return the `id`
     * const progressWithIdOnly = await prisma.progress.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Progress.
     * @param {ProgressDeleteArgs} args - Arguments to delete one Progress.
     * @example
     * // Delete one Progress
     * const Progress = await prisma.progress.delete({
     *   where: {
     *     // ... filter to delete one Progress
     *   }
     * })
     * 
     */
    delete<T extends ProgressDeleteArgs>(args: SelectSubset<T, ProgressDeleteArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Progress.
     * @param {ProgressUpdateArgs} args - Arguments to update one Progress.
     * @example
     * // Update one Progress
     * const progress = await prisma.progress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgressUpdateArgs>(args: SelectSubset<T, ProgressUpdateArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Progresses.
     * @param {ProgressDeleteManyArgs} args - Arguments to filter Progresses to delete.
     * @example
     * // Delete a few Progresses
     * const { count } = await prisma.progress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgressDeleteManyArgs>(args?: SelectSubset<T, ProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Progresses
     * const progress = await prisma.progress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgressUpdateManyArgs>(args: SelectSubset<T, ProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Progress.
     * @param {ProgressUpsertArgs} args - Arguments to update or create a Progress.
     * @example
     * // Update or create a Progress
     * const progress = await prisma.progress.upsert({
     *   create: {
     *     // ... data to create a Progress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Progress we want to update
     *   }
     * })
     */
    upsert<T extends ProgressUpsertArgs>(args: SelectSubset<T, ProgressUpsertArgs<ExtArgs>>): Prisma__ProgressClient<$Result.GetResult<Prisma.$ProgressPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressCountArgs} args - Arguments to filter Progresses to count.
     * @example
     * // Count the number of Progresses
     * const count = await prisma.progress.count({
     *   where: {
     *     // ... the filter for the Progresses we want to count
     *   }
     * })
    **/
    count<T extends ProgressCountArgs>(
      args?: Subset<T, ProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgressAggregateArgs>(args: Subset<T, ProgressAggregateArgs>): Prisma.PrismaPromise<GetProgressAggregateType<T>>

    /**
     * Group by Progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgressGroupByArgs['orderBy'] }
        : { orderBy?: ProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Progress model
   */
  readonly fields: ProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Progress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Progress model
   */ 
  interface ProgressFieldRefs {
    readonly id: FieldRef<"Progress", 'String'>
    readonly userId: FieldRef<"Progress", 'String'>
    readonly document: FieldRef<"Progress", 'String'>
    readonly pagesRead: FieldRef<"Progress", 'Int'>
    readonly minutes: FieldRef<"Progress", 'Int'>
    readonly date: FieldRef<"Progress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Progress findUnique
   */
  export type ProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findUniqueOrThrow
   */
  export type ProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress findFirst
   */
  export type ProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findFirstOrThrow
   */
  export type ProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progress to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Progresses.
     */
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress findMany
   */
  export type ProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter, which Progresses to fetch.
     */
    where?: ProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Progresses to fetch.
     */
    orderBy?: ProgressOrderByWithRelationInput | ProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Progresses.
     */
    cursor?: ProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Progresses.
     */
    skip?: number
    distinct?: ProgressScalarFieldEnum | ProgressScalarFieldEnum[]
  }

  /**
   * Progress create
   */
  export type ProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a Progress.
     */
    data: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
  }

  /**
   * Progress createMany
   */
  export type ProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Progress createManyAndReturn
   */
  export type ProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Progresses.
     */
    data: ProgressCreateManyInput | ProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Progress update
   */
  export type ProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a Progress.
     */
    data: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
    /**
     * Choose, which Progress to update.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress updateMany
   */
  export type ProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Progresses.
     */
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyInput>
    /**
     * Filter which Progresses to update
     */
    where?: ProgressWhereInput
  }

  /**
   * Progress upsert
   */
  export type ProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the Progress to update in case it exists.
     */
    where: ProgressWhereUniqueInput
    /**
     * In case the Progress found by the `where` argument doesn't exist, create a new Progress with this data.
     */
    create: XOR<ProgressCreateInput, ProgressUncheckedCreateInput>
    /**
     * In case the Progress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgressUpdateInput, ProgressUncheckedUpdateInput>
  }

  /**
   * Progress delete
   */
  export type ProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
    /**
     * Filter which Progress to delete.
     */
    where: ProgressWhereUniqueInput
  }

  /**
   * Progress deleteMany
   */
  export type ProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Progresses to delete
     */
    where?: ProgressWhereInput
  }

  /**
   * Progress without action
   */
  export type ProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Progress
     */
    select?: ProgressSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgressInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    fileSize: number | null
    totalChunks: number | null
    processedChunks: number | null
  }

  export type DocumentSumAggregateOutputType = {
    fileSize: number | null
    totalChunks: number | null
    processedChunks: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    originalName: string | null
    contentHash: string | null
    fileSize: number | null
    mimeType: string | null
    status: $Enums.DocumentStatus | null
    isSystemDocument: boolean | null
    totalChunks: number | null
    processedChunks: number | null
    processingError: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    filename: string | null
    originalName: string | null
    contentHash: string | null
    fileSize: number | null
    mimeType: string | null
    status: $Enums.DocumentStatus | null
    isSystemDocument: boolean | null
    totalChunks: number | null
    processedChunks: number | null
    processingError: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    userId: number
    filename: number
    originalName: number
    contentHash: number
    fileSize: number
    mimeType: number
    status: number
    isSystemDocument: number
    totalChunks: number
    processedChunks: number
    processingError: number
    startedAt: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    fileSize?: true
    totalChunks?: true
    processedChunks?: true
  }

  export type DocumentSumAggregateInputType = {
    fileSize?: true
    totalChunks?: true
    processedChunks?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalName?: true
    contentHash?: true
    fileSize?: true
    mimeType?: true
    status?: true
    isSystemDocument?: true
    totalChunks?: true
    processedChunks?: true
    processingError?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalName?: true
    contentHash?: true
    fileSize?: true
    mimeType?: true
    status?: true
    isSystemDocument?: true
    totalChunks?: true
    processedChunks?: true
    processingError?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    userId?: true
    filename?: true
    originalName?: true
    contentHash?: true
    fileSize?: true
    mimeType?: true
    status?: true
    isSystemDocument?: true
    totalChunks?: true
    processedChunks?: true
    processingError?: true
    startedAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    userId: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType: string | null
    status: $Enums.DocumentStatus
    isSystemDocument: boolean
    totalChunks: number | null
    processedChunks: number
    processingError: string | null
    startedAt: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalName?: boolean
    contentHash?: boolean
    fileSize?: boolean
    mimeType?: boolean
    status?: boolean
    isSystemDocument?: boolean
    totalChunks?: boolean
    processedChunks?: boolean
    processingError?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    embeddings?: boolean | Document$embeddingsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalName?: boolean
    contentHash?: boolean
    fileSize?: boolean
    mimeType?: boolean
    status?: boolean
    isSystemDocument?: boolean
    totalChunks?: boolean
    processedChunks?: boolean
    processingError?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    userId?: boolean
    filename?: boolean
    originalName?: boolean
    contentHash?: boolean
    fileSize?: boolean
    mimeType?: boolean
    status?: boolean
    isSystemDocument?: boolean
    totalChunks?: boolean
    processedChunks?: boolean
    processingError?: boolean
    startedAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    embeddings?: boolean | Document$embeddingsArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      embeddings: Prisma.$EmbeddingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      filename: string
      originalName: string
      contentHash: string
      fileSize: number
      mimeType: string | null
      status: $Enums.DocumentStatus
      isSystemDocument: boolean
      totalChunks: number | null
      processedChunks: number
      processingError: string | null
      startedAt: Date | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    embeddings<T extends Document$embeddingsArgs<ExtArgs> = {}>(args?: Subset<T, Document$embeddingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */ 
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly userId: FieldRef<"Document", 'String'>
    readonly filename: FieldRef<"Document", 'String'>
    readonly originalName: FieldRef<"Document", 'String'>
    readonly contentHash: FieldRef<"Document", 'String'>
    readonly fileSize: FieldRef<"Document", 'Int'>
    readonly mimeType: FieldRef<"Document", 'String'>
    readonly status: FieldRef<"Document", 'DocumentStatus'>
    readonly isSystemDocument: FieldRef<"Document", 'Boolean'>
    readonly totalChunks: FieldRef<"Document", 'Int'>
    readonly processedChunks: FieldRef<"Document", 'Int'>
    readonly processingError: FieldRef<"Document", 'String'>
    readonly startedAt: FieldRef<"Document", 'DateTime'>
    readonly completedAt: FieldRef<"Document", 'DateTime'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
  }

  /**
   * Document.embeddings
   */
  export type Document$embeddingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    where?: EmbeddingWhereInput
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    cursor?: EmbeddingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmbeddingScalarFieldEnum | EmbeddingScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model Embedding
   */

  export type AggregateEmbedding = {
    _count: EmbeddingCountAggregateOutputType | null
    _avg: EmbeddingAvgAggregateOutputType | null
    _sum: EmbeddingSumAggregateOutputType | null
    _min: EmbeddingMinAggregateOutputType | null
    _max: EmbeddingMaxAggregateOutputType | null
  }

  export type EmbeddingAvgAggregateOutputType = {
    chunkIndex: number | null
    totalChunks: number | null
    startLine: number | null
    endLine: number | null
    sectionLevel: number | null
    pageStart: number | null
    pageEnd: number | null
    wordCount: number | null
  }

  export type EmbeddingSumAggregateOutputType = {
    chunkIndex: number | null
    totalChunks: number | null
    startLine: number | null
    endLine: number | null
    sectionLevel: number | null
    pageStart: number | null
    pageEnd: number | null
    wordCount: number | null
  }

  export type EmbeddingMinAggregateOutputType = {
    id: string | null
    userId: string | null
    documentId: string | null
    source: string | null
    chunk: string | null
    documentType: string | null
    chunkIndex: number | null
    totalChunks: number | null
    section: string | null
    startLine: number | null
    endLine: number | null
    sectionLevel: number | null
    pageStart: number | null
    pageEnd: number | null
    hasTable: boolean | null
    hasImage: boolean | null
    wordCount: number | null
    createdAt: Date | null
  }

  export type EmbeddingMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    documentId: string | null
    source: string | null
    chunk: string | null
    documentType: string | null
    chunkIndex: number | null
    totalChunks: number | null
    section: string | null
    startLine: number | null
    endLine: number | null
    sectionLevel: number | null
    pageStart: number | null
    pageEnd: number | null
    hasTable: boolean | null
    hasImage: boolean | null
    wordCount: number | null
    createdAt: Date | null
  }

  export type EmbeddingCountAggregateOutputType = {
    id: number
    userId: number
    documentId: number
    source: number
    chunk: number
    embedding: number
    documentType: number
    chunkIndex: number
    totalChunks: number
    section: number
    startLine: number
    endLine: number
    chunkingConfig: number
    sectionLevel: number
    pageStart: number
    pageEnd: number
    hasTable: number
    hasImage: number
    wordCount: number
    createdAt: number
    _all: number
  }


  export type EmbeddingAvgAggregateInputType = {
    chunkIndex?: true
    totalChunks?: true
    startLine?: true
    endLine?: true
    sectionLevel?: true
    pageStart?: true
    pageEnd?: true
    wordCount?: true
  }

  export type EmbeddingSumAggregateInputType = {
    chunkIndex?: true
    totalChunks?: true
    startLine?: true
    endLine?: true
    sectionLevel?: true
    pageStart?: true
    pageEnd?: true
    wordCount?: true
  }

  export type EmbeddingMinAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    source?: true
    chunk?: true
    documentType?: true
    chunkIndex?: true
    totalChunks?: true
    section?: true
    startLine?: true
    endLine?: true
    sectionLevel?: true
    pageStart?: true
    pageEnd?: true
    hasTable?: true
    hasImage?: true
    wordCount?: true
    createdAt?: true
  }

  export type EmbeddingMaxAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    source?: true
    chunk?: true
    documentType?: true
    chunkIndex?: true
    totalChunks?: true
    section?: true
    startLine?: true
    endLine?: true
    sectionLevel?: true
    pageStart?: true
    pageEnd?: true
    hasTable?: true
    hasImage?: true
    wordCount?: true
    createdAt?: true
  }

  export type EmbeddingCountAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    source?: true
    chunk?: true
    embedding?: true
    documentType?: true
    chunkIndex?: true
    totalChunks?: true
    section?: true
    startLine?: true
    endLine?: true
    chunkingConfig?: true
    sectionLevel?: true
    pageStart?: true
    pageEnd?: true
    hasTable?: true
    hasImage?: true
    wordCount?: true
    createdAt?: true
    _all?: true
  }

  export type EmbeddingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Embedding to aggregate.
     */
    where?: EmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Embeddings to fetch.
     */
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Embeddings
    **/
    _count?: true | EmbeddingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmbeddingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmbeddingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmbeddingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmbeddingMaxAggregateInputType
  }

  export type GetEmbeddingAggregateType<T extends EmbeddingAggregateArgs> = {
        [P in keyof T & keyof AggregateEmbedding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmbedding[P]>
      : GetScalarType<T[P], AggregateEmbedding[P]>
  }




  export type EmbeddingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmbeddingWhereInput
    orderBy?: EmbeddingOrderByWithAggregationInput | EmbeddingOrderByWithAggregationInput[]
    by: EmbeddingScalarFieldEnum[] | EmbeddingScalarFieldEnum
    having?: EmbeddingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmbeddingCountAggregateInputType | true
    _avg?: EmbeddingAvgAggregateInputType
    _sum?: EmbeddingSumAggregateInputType
    _min?: EmbeddingMinAggregateInputType
    _max?: EmbeddingMaxAggregateInputType
  }

  export type EmbeddingGroupByOutputType = {
    id: string
    userId: string | null
    documentId: string | null
    source: string
    chunk: string
    embedding: JsonValue
    documentType: string | null
    chunkIndex: number | null
    totalChunks: number | null
    section: string | null
    startLine: number | null
    endLine: number | null
    chunkingConfig: JsonValue | null
    sectionLevel: number | null
    pageStart: number | null
    pageEnd: number | null
    hasTable: boolean
    hasImage: boolean
    wordCount: number | null
    createdAt: Date
    _count: EmbeddingCountAggregateOutputType | null
    _avg: EmbeddingAvgAggregateOutputType | null
    _sum: EmbeddingSumAggregateOutputType | null
    _min: EmbeddingMinAggregateOutputType | null
    _max: EmbeddingMaxAggregateOutputType | null
  }

  type GetEmbeddingGroupByPayload<T extends EmbeddingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmbeddingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmbeddingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmbeddingGroupByOutputType[P]>
            : GetScalarType<T[P], EmbeddingGroupByOutputType[P]>
        }
      >
    >


  export type EmbeddingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    source?: boolean
    chunk?: boolean
    embedding?: boolean
    documentType?: boolean
    chunkIndex?: boolean
    totalChunks?: boolean
    section?: boolean
    startLine?: boolean
    endLine?: boolean
    chunkingConfig?: boolean
    sectionLevel?: boolean
    pageStart?: boolean
    pageEnd?: boolean
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: boolean
    createdAt?: boolean
    user?: boolean | Embedding$userArgs<ExtArgs>
    document?: boolean | Embedding$documentArgs<ExtArgs>
  }, ExtArgs["result"]["embedding"]>

  export type EmbeddingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    source?: boolean
    chunk?: boolean
    embedding?: boolean
    documentType?: boolean
    chunkIndex?: boolean
    totalChunks?: boolean
    section?: boolean
    startLine?: boolean
    endLine?: boolean
    chunkingConfig?: boolean
    sectionLevel?: boolean
    pageStart?: boolean
    pageEnd?: boolean
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: boolean
    createdAt?: boolean
    user?: boolean | Embedding$userArgs<ExtArgs>
    document?: boolean | Embedding$documentArgs<ExtArgs>
  }, ExtArgs["result"]["embedding"]>

  export type EmbeddingSelectScalar = {
    id?: boolean
    userId?: boolean
    documentId?: boolean
    source?: boolean
    chunk?: boolean
    embedding?: boolean
    documentType?: boolean
    chunkIndex?: boolean
    totalChunks?: boolean
    section?: boolean
    startLine?: boolean
    endLine?: boolean
    chunkingConfig?: boolean
    sectionLevel?: boolean
    pageStart?: boolean
    pageEnd?: boolean
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: boolean
    createdAt?: boolean
  }

  export type EmbeddingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Embedding$userArgs<ExtArgs>
    document?: boolean | Embedding$documentArgs<ExtArgs>
  }
  export type EmbeddingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Embedding$userArgs<ExtArgs>
    document?: boolean | Embedding$documentArgs<ExtArgs>
  }

  export type $EmbeddingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Embedding"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      document: Prisma.$DocumentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      documentId: string | null
      source: string
      chunk: string
      embedding: Prisma.JsonValue
      documentType: string | null
      chunkIndex: number | null
      totalChunks: number | null
      section: string | null
      startLine: number | null
      endLine: number | null
      chunkingConfig: Prisma.JsonValue | null
      sectionLevel: number | null
      pageStart: number | null
      pageEnd: number | null
      hasTable: boolean
      hasImage: boolean
      wordCount: number | null
      createdAt: Date
    }, ExtArgs["result"]["embedding"]>
    composites: {}
  }

  type EmbeddingGetPayload<S extends boolean | null | undefined | EmbeddingDefaultArgs> = $Result.GetResult<Prisma.$EmbeddingPayload, S>

  type EmbeddingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EmbeddingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EmbeddingCountAggregateInputType | true
    }

  export interface EmbeddingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Embedding'], meta: { name: 'Embedding' } }
    /**
     * Find zero or one Embedding that matches the filter.
     * @param {EmbeddingFindUniqueArgs} args - Arguments to find a Embedding
     * @example
     * // Get one Embedding
     * const embedding = await prisma.embedding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmbeddingFindUniqueArgs>(args: SelectSubset<T, EmbeddingFindUniqueArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Embedding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EmbeddingFindUniqueOrThrowArgs} args - Arguments to find a Embedding
     * @example
     * // Get one Embedding
     * const embedding = await prisma.embedding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmbeddingFindUniqueOrThrowArgs>(args: SelectSubset<T, EmbeddingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Embedding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingFindFirstArgs} args - Arguments to find a Embedding
     * @example
     * // Get one Embedding
     * const embedding = await prisma.embedding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmbeddingFindFirstArgs>(args?: SelectSubset<T, EmbeddingFindFirstArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Embedding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingFindFirstOrThrowArgs} args - Arguments to find a Embedding
     * @example
     * // Get one Embedding
     * const embedding = await prisma.embedding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmbeddingFindFirstOrThrowArgs>(args?: SelectSubset<T, EmbeddingFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Embeddings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Embeddings
     * const embeddings = await prisma.embedding.findMany()
     * 
     * // Get first 10 Embeddings
     * const embeddings = await prisma.embedding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const embeddingWithIdOnly = await prisma.embedding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmbeddingFindManyArgs>(args?: SelectSubset<T, EmbeddingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Embedding.
     * @param {EmbeddingCreateArgs} args - Arguments to create a Embedding.
     * @example
     * // Create one Embedding
     * const Embedding = await prisma.embedding.create({
     *   data: {
     *     // ... data to create a Embedding
     *   }
     * })
     * 
     */
    create<T extends EmbeddingCreateArgs>(args: SelectSubset<T, EmbeddingCreateArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Embeddings.
     * @param {EmbeddingCreateManyArgs} args - Arguments to create many Embeddings.
     * @example
     * // Create many Embeddings
     * const embedding = await prisma.embedding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmbeddingCreateManyArgs>(args?: SelectSubset<T, EmbeddingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Embeddings and returns the data saved in the database.
     * @param {EmbeddingCreateManyAndReturnArgs} args - Arguments to create many Embeddings.
     * @example
     * // Create many Embeddings
     * const embedding = await prisma.embedding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Embeddings and only return the `id`
     * const embeddingWithIdOnly = await prisma.embedding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmbeddingCreateManyAndReturnArgs>(args?: SelectSubset<T, EmbeddingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Embedding.
     * @param {EmbeddingDeleteArgs} args - Arguments to delete one Embedding.
     * @example
     * // Delete one Embedding
     * const Embedding = await prisma.embedding.delete({
     *   where: {
     *     // ... filter to delete one Embedding
     *   }
     * })
     * 
     */
    delete<T extends EmbeddingDeleteArgs>(args: SelectSubset<T, EmbeddingDeleteArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Embedding.
     * @param {EmbeddingUpdateArgs} args - Arguments to update one Embedding.
     * @example
     * // Update one Embedding
     * const embedding = await prisma.embedding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmbeddingUpdateArgs>(args: SelectSubset<T, EmbeddingUpdateArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Embeddings.
     * @param {EmbeddingDeleteManyArgs} args - Arguments to filter Embeddings to delete.
     * @example
     * // Delete a few Embeddings
     * const { count } = await prisma.embedding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmbeddingDeleteManyArgs>(args?: SelectSubset<T, EmbeddingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Embeddings
     * const embedding = await prisma.embedding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmbeddingUpdateManyArgs>(args: SelectSubset<T, EmbeddingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Embedding.
     * @param {EmbeddingUpsertArgs} args - Arguments to update or create a Embedding.
     * @example
     * // Update or create a Embedding
     * const embedding = await prisma.embedding.upsert({
     *   create: {
     *     // ... data to create a Embedding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Embedding we want to update
     *   }
     * })
     */
    upsert<T extends EmbeddingUpsertArgs>(args: SelectSubset<T, EmbeddingUpsertArgs<ExtArgs>>): Prisma__EmbeddingClient<$Result.GetResult<Prisma.$EmbeddingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Embeddings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingCountArgs} args - Arguments to filter Embeddings to count.
     * @example
     * // Count the number of Embeddings
     * const count = await prisma.embedding.count({
     *   where: {
     *     // ... the filter for the Embeddings we want to count
     *   }
     * })
    **/
    count<T extends EmbeddingCountArgs>(
      args?: Subset<T, EmbeddingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmbeddingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Embedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmbeddingAggregateArgs>(args: Subset<T, EmbeddingAggregateArgs>): Prisma.PrismaPromise<GetEmbeddingAggregateType<T>>

    /**
     * Group by Embedding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmbeddingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmbeddingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmbeddingGroupByArgs['orderBy'] }
        : { orderBy?: EmbeddingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmbeddingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmbeddingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Embedding model
   */
  readonly fields: EmbeddingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Embedding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmbeddingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Embedding$userArgs<ExtArgs> = {}>(args?: Subset<T, Embedding$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    document<T extends Embedding$documentArgs<ExtArgs> = {}>(args?: Subset<T, Embedding$documentArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Embedding model
   */ 
  interface EmbeddingFieldRefs {
    readonly id: FieldRef<"Embedding", 'String'>
    readonly userId: FieldRef<"Embedding", 'String'>
    readonly documentId: FieldRef<"Embedding", 'String'>
    readonly source: FieldRef<"Embedding", 'String'>
    readonly chunk: FieldRef<"Embedding", 'String'>
    readonly embedding: FieldRef<"Embedding", 'Json'>
    readonly documentType: FieldRef<"Embedding", 'String'>
    readonly chunkIndex: FieldRef<"Embedding", 'Int'>
    readonly totalChunks: FieldRef<"Embedding", 'Int'>
    readonly section: FieldRef<"Embedding", 'String'>
    readonly startLine: FieldRef<"Embedding", 'Int'>
    readonly endLine: FieldRef<"Embedding", 'Int'>
    readonly chunkingConfig: FieldRef<"Embedding", 'Json'>
    readonly sectionLevel: FieldRef<"Embedding", 'Int'>
    readonly pageStart: FieldRef<"Embedding", 'Int'>
    readonly pageEnd: FieldRef<"Embedding", 'Int'>
    readonly hasTable: FieldRef<"Embedding", 'Boolean'>
    readonly hasImage: FieldRef<"Embedding", 'Boolean'>
    readonly wordCount: FieldRef<"Embedding", 'Int'>
    readonly createdAt: FieldRef<"Embedding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Embedding findUnique
   */
  export type EmbeddingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which Embedding to fetch.
     */
    where: EmbeddingWhereUniqueInput
  }

  /**
   * Embedding findUniqueOrThrow
   */
  export type EmbeddingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which Embedding to fetch.
     */
    where: EmbeddingWhereUniqueInput
  }

  /**
   * Embedding findFirst
   */
  export type EmbeddingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which Embedding to fetch.
     */
    where?: EmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Embeddings to fetch.
     */
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Embeddings.
     */
    cursor?: EmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Embeddings.
     */
    distinct?: EmbeddingScalarFieldEnum | EmbeddingScalarFieldEnum[]
  }

  /**
   * Embedding findFirstOrThrow
   */
  export type EmbeddingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which Embedding to fetch.
     */
    where?: EmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Embeddings to fetch.
     */
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Embeddings.
     */
    cursor?: EmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Embeddings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Embeddings.
     */
    distinct?: EmbeddingScalarFieldEnum | EmbeddingScalarFieldEnum[]
  }

  /**
   * Embedding findMany
   */
  export type EmbeddingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter, which Embeddings to fetch.
     */
    where?: EmbeddingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Embeddings to fetch.
     */
    orderBy?: EmbeddingOrderByWithRelationInput | EmbeddingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Embeddings.
     */
    cursor?: EmbeddingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Embeddings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Embeddings.
     */
    skip?: number
    distinct?: EmbeddingScalarFieldEnum | EmbeddingScalarFieldEnum[]
  }

  /**
   * Embedding create
   */
  export type EmbeddingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * The data needed to create a Embedding.
     */
    data: XOR<EmbeddingCreateInput, EmbeddingUncheckedCreateInput>
  }

  /**
   * Embedding createMany
   */
  export type EmbeddingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Embeddings.
     */
    data: EmbeddingCreateManyInput | EmbeddingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Embedding createManyAndReturn
   */
  export type EmbeddingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Embeddings.
     */
    data: EmbeddingCreateManyInput | EmbeddingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Embedding update
   */
  export type EmbeddingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * The data needed to update a Embedding.
     */
    data: XOR<EmbeddingUpdateInput, EmbeddingUncheckedUpdateInput>
    /**
     * Choose, which Embedding to update.
     */
    where: EmbeddingWhereUniqueInput
  }

  /**
   * Embedding updateMany
   */
  export type EmbeddingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Embeddings.
     */
    data: XOR<EmbeddingUpdateManyMutationInput, EmbeddingUncheckedUpdateManyInput>
    /**
     * Filter which Embeddings to update
     */
    where?: EmbeddingWhereInput
  }

  /**
   * Embedding upsert
   */
  export type EmbeddingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * The filter to search for the Embedding to update in case it exists.
     */
    where: EmbeddingWhereUniqueInput
    /**
     * In case the Embedding found by the `where` argument doesn't exist, create a new Embedding with this data.
     */
    create: XOR<EmbeddingCreateInput, EmbeddingUncheckedCreateInput>
    /**
     * In case the Embedding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmbeddingUpdateInput, EmbeddingUncheckedUpdateInput>
  }

  /**
   * Embedding delete
   */
  export type EmbeddingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
    /**
     * Filter which Embedding to delete.
     */
    where: EmbeddingWhereUniqueInput
  }

  /**
   * Embedding deleteMany
   */
  export type EmbeddingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Embeddings to delete
     */
    where?: EmbeddingWhereInput
  }

  /**
   * Embedding.user
   */
  export type Embedding$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Embedding.document
   */
  export type Embedding$documentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
  }

  /**
   * Embedding without action
   */
  export type EmbeddingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Embedding
     */
    select?: EmbeddingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmbeddingInclude<ExtArgs> | null
  }


  /**
   * Model RetrievalLog
   */

  export type AggregateRetrievalLog = {
    _count: RetrievalLogCountAggregateOutputType | null
    _min: RetrievalLogMinAggregateOutputType | null
    _max: RetrievalLogMaxAggregateOutputType | null
  }

  export type RetrievalLogMinAggregateOutputType = {
    id: string | null
    query: string | null
    createdAt: Date | null
  }

  export type RetrievalLogMaxAggregateOutputType = {
    id: string | null
    query: string | null
    createdAt: Date | null
  }

  export type RetrievalLogCountAggregateOutputType = {
    id: number
    query: number
    results: number
    metrics: number
    createdAt: number
    _all: number
  }


  export type RetrievalLogMinAggregateInputType = {
    id?: true
    query?: true
    createdAt?: true
  }

  export type RetrievalLogMaxAggregateInputType = {
    id?: true
    query?: true
    createdAt?: true
  }

  export type RetrievalLogCountAggregateInputType = {
    id?: true
    query?: true
    results?: true
    metrics?: true
    createdAt?: true
    _all?: true
  }

  export type RetrievalLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetrievalLog to aggregate.
     */
    where?: RetrievalLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetrievalLogs to fetch.
     */
    orderBy?: RetrievalLogOrderByWithRelationInput | RetrievalLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RetrievalLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetrievalLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetrievalLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RetrievalLogs
    **/
    _count?: true | RetrievalLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RetrievalLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RetrievalLogMaxAggregateInputType
  }

  export type GetRetrievalLogAggregateType<T extends RetrievalLogAggregateArgs> = {
        [P in keyof T & keyof AggregateRetrievalLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRetrievalLog[P]>
      : GetScalarType<T[P], AggregateRetrievalLog[P]>
  }




  export type RetrievalLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RetrievalLogWhereInput
    orderBy?: RetrievalLogOrderByWithAggregationInput | RetrievalLogOrderByWithAggregationInput[]
    by: RetrievalLogScalarFieldEnum[] | RetrievalLogScalarFieldEnum
    having?: RetrievalLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RetrievalLogCountAggregateInputType | true
    _min?: RetrievalLogMinAggregateInputType
    _max?: RetrievalLogMaxAggregateInputType
  }

  export type RetrievalLogGroupByOutputType = {
    id: string
    query: string
    results: JsonValue
    metrics: JsonValue | null
    createdAt: Date
    _count: RetrievalLogCountAggregateOutputType | null
    _min: RetrievalLogMinAggregateOutputType | null
    _max: RetrievalLogMaxAggregateOutputType | null
  }

  type GetRetrievalLogGroupByPayload<T extends RetrievalLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RetrievalLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RetrievalLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RetrievalLogGroupByOutputType[P]>
            : GetScalarType<T[P], RetrievalLogGroupByOutputType[P]>
        }
      >
    >


  export type RetrievalLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    query?: boolean
    results?: boolean
    metrics?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retrievalLog"]>

  export type RetrievalLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    query?: boolean
    results?: boolean
    metrics?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["retrievalLog"]>

  export type RetrievalLogSelectScalar = {
    id?: boolean
    query?: boolean
    results?: boolean
    metrics?: boolean
    createdAt?: boolean
  }


  export type $RetrievalLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RetrievalLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      query: string
      results: Prisma.JsonValue
      metrics: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["retrievalLog"]>
    composites: {}
  }

  type RetrievalLogGetPayload<S extends boolean | null | undefined | RetrievalLogDefaultArgs> = $Result.GetResult<Prisma.$RetrievalLogPayload, S>

  type RetrievalLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RetrievalLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RetrievalLogCountAggregateInputType | true
    }

  export interface RetrievalLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RetrievalLog'], meta: { name: 'RetrievalLog' } }
    /**
     * Find zero or one RetrievalLog that matches the filter.
     * @param {RetrievalLogFindUniqueArgs} args - Arguments to find a RetrievalLog
     * @example
     * // Get one RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RetrievalLogFindUniqueArgs>(args: SelectSubset<T, RetrievalLogFindUniqueArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RetrievalLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RetrievalLogFindUniqueOrThrowArgs} args - Arguments to find a RetrievalLog
     * @example
     * // Get one RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RetrievalLogFindUniqueOrThrowArgs>(args: SelectSubset<T, RetrievalLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RetrievalLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogFindFirstArgs} args - Arguments to find a RetrievalLog
     * @example
     * // Get one RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RetrievalLogFindFirstArgs>(args?: SelectSubset<T, RetrievalLogFindFirstArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RetrievalLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogFindFirstOrThrowArgs} args - Arguments to find a RetrievalLog
     * @example
     * // Get one RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RetrievalLogFindFirstOrThrowArgs>(args?: SelectSubset<T, RetrievalLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RetrievalLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RetrievalLogs
     * const retrievalLogs = await prisma.retrievalLog.findMany()
     * 
     * // Get first 10 RetrievalLogs
     * const retrievalLogs = await prisma.retrievalLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const retrievalLogWithIdOnly = await prisma.retrievalLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RetrievalLogFindManyArgs>(args?: SelectSubset<T, RetrievalLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RetrievalLog.
     * @param {RetrievalLogCreateArgs} args - Arguments to create a RetrievalLog.
     * @example
     * // Create one RetrievalLog
     * const RetrievalLog = await prisma.retrievalLog.create({
     *   data: {
     *     // ... data to create a RetrievalLog
     *   }
     * })
     * 
     */
    create<T extends RetrievalLogCreateArgs>(args: SelectSubset<T, RetrievalLogCreateArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RetrievalLogs.
     * @param {RetrievalLogCreateManyArgs} args - Arguments to create many RetrievalLogs.
     * @example
     * // Create many RetrievalLogs
     * const retrievalLog = await prisma.retrievalLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RetrievalLogCreateManyArgs>(args?: SelectSubset<T, RetrievalLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RetrievalLogs and returns the data saved in the database.
     * @param {RetrievalLogCreateManyAndReturnArgs} args - Arguments to create many RetrievalLogs.
     * @example
     * // Create many RetrievalLogs
     * const retrievalLog = await prisma.retrievalLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RetrievalLogs and only return the `id`
     * const retrievalLogWithIdOnly = await prisma.retrievalLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RetrievalLogCreateManyAndReturnArgs>(args?: SelectSubset<T, RetrievalLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RetrievalLog.
     * @param {RetrievalLogDeleteArgs} args - Arguments to delete one RetrievalLog.
     * @example
     * // Delete one RetrievalLog
     * const RetrievalLog = await prisma.retrievalLog.delete({
     *   where: {
     *     // ... filter to delete one RetrievalLog
     *   }
     * })
     * 
     */
    delete<T extends RetrievalLogDeleteArgs>(args: SelectSubset<T, RetrievalLogDeleteArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RetrievalLog.
     * @param {RetrievalLogUpdateArgs} args - Arguments to update one RetrievalLog.
     * @example
     * // Update one RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RetrievalLogUpdateArgs>(args: SelectSubset<T, RetrievalLogUpdateArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RetrievalLogs.
     * @param {RetrievalLogDeleteManyArgs} args - Arguments to filter RetrievalLogs to delete.
     * @example
     * // Delete a few RetrievalLogs
     * const { count } = await prisma.retrievalLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RetrievalLogDeleteManyArgs>(args?: SelectSubset<T, RetrievalLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RetrievalLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RetrievalLogs
     * const retrievalLog = await prisma.retrievalLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RetrievalLogUpdateManyArgs>(args: SelectSubset<T, RetrievalLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RetrievalLog.
     * @param {RetrievalLogUpsertArgs} args - Arguments to update or create a RetrievalLog.
     * @example
     * // Update or create a RetrievalLog
     * const retrievalLog = await prisma.retrievalLog.upsert({
     *   create: {
     *     // ... data to create a RetrievalLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RetrievalLog we want to update
     *   }
     * })
     */
    upsert<T extends RetrievalLogUpsertArgs>(args: SelectSubset<T, RetrievalLogUpsertArgs<ExtArgs>>): Prisma__RetrievalLogClient<$Result.GetResult<Prisma.$RetrievalLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RetrievalLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogCountArgs} args - Arguments to filter RetrievalLogs to count.
     * @example
     * // Count the number of RetrievalLogs
     * const count = await prisma.retrievalLog.count({
     *   where: {
     *     // ... the filter for the RetrievalLogs we want to count
     *   }
     * })
    **/
    count<T extends RetrievalLogCountArgs>(
      args?: Subset<T, RetrievalLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RetrievalLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RetrievalLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RetrievalLogAggregateArgs>(args: Subset<T, RetrievalLogAggregateArgs>): Prisma.PrismaPromise<GetRetrievalLogAggregateType<T>>

    /**
     * Group by RetrievalLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RetrievalLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RetrievalLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RetrievalLogGroupByArgs['orderBy'] }
        : { orderBy?: RetrievalLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RetrievalLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRetrievalLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RetrievalLog model
   */
  readonly fields: RetrievalLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RetrievalLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RetrievalLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RetrievalLog model
   */ 
  interface RetrievalLogFieldRefs {
    readonly id: FieldRef<"RetrievalLog", 'String'>
    readonly query: FieldRef<"RetrievalLog", 'String'>
    readonly results: FieldRef<"RetrievalLog", 'Json'>
    readonly metrics: FieldRef<"RetrievalLog", 'Json'>
    readonly createdAt: FieldRef<"RetrievalLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RetrievalLog findUnique
   */
  export type RetrievalLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter, which RetrievalLog to fetch.
     */
    where: RetrievalLogWhereUniqueInput
  }

  /**
   * RetrievalLog findUniqueOrThrow
   */
  export type RetrievalLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter, which RetrievalLog to fetch.
     */
    where: RetrievalLogWhereUniqueInput
  }

  /**
   * RetrievalLog findFirst
   */
  export type RetrievalLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter, which RetrievalLog to fetch.
     */
    where?: RetrievalLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetrievalLogs to fetch.
     */
    orderBy?: RetrievalLogOrderByWithRelationInput | RetrievalLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetrievalLogs.
     */
    cursor?: RetrievalLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetrievalLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetrievalLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetrievalLogs.
     */
    distinct?: RetrievalLogScalarFieldEnum | RetrievalLogScalarFieldEnum[]
  }

  /**
   * RetrievalLog findFirstOrThrow
   */
  export type RetrievalLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter, which RetrievalLog to fetch.
     */
    where?: RetrievalLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetrievalLogs to fetch.
     */
    orderBy?: RetrievalLogOrderByWithRelationInput | RetrievalLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RetrievalLogs.
     */
    cursor?: RetrievalLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetrievalLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetrievalLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RetrievalLogs.
     */
    distinct?: RetrievalLogScalarFieldEnum | RetrievalLogScalarFieldEnum[]
  }

  /**
   * RetrievalLog findMany
   */
  export type RetrievalLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter, which RetrievalLogs to fetch.
     */
    where?: RetrievalLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RetrievalLogs to fetch.
     */
    orderBy?: RetrievalLogOrderByWithRelationInput | RetrievalLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RetrievalLogs.
     */
    cursor?: RetrievalLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RetrievalLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RetrievalLogs.
     */
    skip?: number
    distinct?: RetrievalLogScalarFieldEnum | RetrievalLogScalarFieldEnum[]
  }

  /**
   * RetrievalLog create
   */
  export type RetrievalLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * The data needed to create a RetrievalLog.
     */
    data: XOR<RetrievalLogCreateInput, RetrievalLogUncheckedCreateInput>
  }

  /**
   * RetrievalLog createMany
   */
  export type RetrievalLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RetrievalLogs.
     */
    data: RetrievalLogCreateManyInput | RetrievalLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetrievalLog createManyAndReturn
   */
  export type RetrievalLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RetrievalLogs.
     */
    data: RetrievalLogCreateManyInput | RetrievalLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RetrievalLog update
   */
  export type RetrievalLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * The data needed to update a RetrievalLog.
     */
    data: XOR<RetrievalLogUpdateInput, RetrievalLogUncheckedUpdateInput>
    /**
     * Choose, which RetrievalLog to update.
     */
    where: RetrievalLogWhereUniqueInput
  }

  /**
   * RetrievalLog updateMany
   */
  export type RetrievalLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RetrievalLogs.
     */
    data: XOR<RetrievalLogUpdateManyMutationInput, RetrievalLogUncheckedUpdateManyInput>
    /**
     * Filter which RetrievalLogs to update
     */
    where?: RetrievalLogWhereInput
  }

  /**
   * RetrievalLog upsert
   */
  export type RetrievalLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * The filter to search for the RetrievalLog to update in case it exists.
     */
    where: RetrievalLogWhereUniqueInput
    /**
     * In case the RetrievalLog found by the `where` argument doesn't exist, create a new RetrievalLog with this data.
     */
    create: XOR<RetrievalLogCreateInput, RetrievalLogUncheckedCreateInput>
    /**
     * In case the RetrievalLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RetrievalLogUpdateInput, RetrievalLogUncheckedUpdateInput>
  }

  /**
   * RetrievalLog delete
   */
  export type RetrievalLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
    /**
     * Filter which RetrievalLog to delete.
     */
    where: RetrievalLogWhereUniqueInput
  }

  /**
   * RetrievalLog deleteMany
   */
  export type RetrievalLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RetrievalLogs to delete
     */
    where?: RetrievalLogWhereInput
  }

  /**
   * RetrievalLog without action
   */
  export type RetrievalLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RetrievalLog
     */
    select?: RetrievalLogSelect<ExtArgs> | null
  }


  /**
   * Model Topic
   */

  export type AggregateTopic = {
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  export type TopicAvgAggregateOutputType = {
    level: number | null
    chapterNum: number | null
    expectedQuestions: number | null
  }

  export type TopicSumAggregateOutputType = {
    level: number | null
    chapterNum: number | null
    expectedQuestions: number | null
  }

  export type TopicMinAggregateOutputType = {
    id: string | null
    level: number | null
    name: string | null
    slug: string | null
    parentId: string | null
    chapterNum: number | null
    expectedQuestions: number | null
    createdAt: Date | null
  }

  export type TopicMaxAggregateOutputType = {
    id: string | null
    level: number | null
    name: string | null
    slug: string | null
    parentId: string | null
    chapterNum: number | null
    expectedQuestions: number | null
    createdAt: Date | null
  }

  export type TopicCountAggregateOutputType = {
    id: number
    level: number
    name: number
    slug: number
    parentId: number
    chapterNum: number
    keywords: number
    aliases: number
    expectedQuestions: number
    createdAt: number
    _all: number
  }


  export type TopicAvgAggregateInputType = {
    level?: true
    chapterNum?: true
    expectedQuestions?: true
  }

  export type TopicSumAggregateInputType = {
    level?: true
    chapterNum?: true
    expectedQuestions?: true
  }

  export type TopicMinAggregateInputType = {
    id?: true
    level?: true
    name?: true
    slug?: true
    parentId?: true
    chapterNum?: true
    expectedQuestions?: true
    createdAt?: true
  }

  export type TopicMaxAggregateInputType = {
    id?: true
    level?: true
    name?: true
    slug?: true
    parentId?: true
    chapterNum?: true
    expectedQuestions?: true
    createdAt?: true
  }

  export type TopicCountAggregateInputType = {
    id?: true
    level?: true
    name?: true
    slug?: true
    parentId?: true
    chapterNum?: true
    keywords?: true
    aliases?: true
    expectedQuestions?: true
    createdAt?: true
    _all?: true
  }

  export type TopicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topic to aggregate.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Topics
    **/
    _count?: true | TopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicMaxAggregateInputType
  }

  export type GetTopicAggregateType<T extends TopicAggregateArgs> = {
        [P in keyof T & keyof AggregateTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopic[P]>
      : GetScalarType<T[P], AggregateTopic[P]>
  }




  export type TopicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithAggregationInput | TopicOrderByWithAggregationInput[]
    by: TopicScalarFieldEnum[] | TopicScalarFieldEnum
    having?: TopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicCountAggregateInputType | true
    _avg?: TopicAvgAggregateInputType
    _sum?: TopicSumAggregateInputType
    _min?: TopicMinAggregateInputType
    _max?: TopicMaxAggregateInputType
  }

  export type TopicGroupByOutputType = {
    id: string
    level: number
    name: string
    slug: string
    parentId: string | null
    chapterNum: number | null
    keywords: string[]
    aliases: string[]
    expectedQuestions: number
    createdAt: Date
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  type GetTopicGroupByPayload<T extends TopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicGroupByOutputType[P]>
            : GetScalarType<T[P], TopicGroupByOutputType[P]>
        }
      >
    >


  export type TopicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    level?: boolean
    name?: boolean
    slug?: boolean
    parentId?: boolean
    chapterNum?: boolean
    keywords?: boolean
    aliases?: boolean
    expectedQuestions?: boolean
    createdAt?: boolean
    parent?: boolean | Topic$parentArgs<ExtArgs>
    children?: boolean | Topic$childrenArgs<ExtArgs>
    interactions?: boolean | Topic$interactionsArgs<ExtArgs>
    masteries?: boolean | Topic$masteriesArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    level?: boolean
    name?: boolean
    slug?: boolean
    parentId?: boolean
    chapterNum?: boolean
    keywords?: boolean
    aliases?: boolean
    expectedQuestions?: boolean
    createdAt?: boolean
    parent?: boolean | Topic$parentArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectScalar = {
    id?: boolean
    level?: boolean
    name?: boolean
    slug?: boolean
    parentId?: boolean
    chapterNum?: boolean
    keywords?: boolean
    aliases?: boolean
    expectedQuestions?: boolean
    createdAt?: boolean
  }

  export type TopicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Topic$parentArgs<ExtArgs>
    children?: boolean | Topic$childrenArgs<ExtArgs>
    interactions?: boolean | Topic$interactionsArgs<ExtArgs>
    masteries?: boolean | Topic$masteriesArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TopicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parent?: boolean | Topic$parentArgs<ExtArgs>
  }

  export type $TopicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Topic"
    objects: {
      parent: Prisma.$TopicPayload<ExtArgs> | null
      children: Prisma.$TopicPayload<ExtArgs>[]
      interactions: Prisma.$TopicInteractionPayload<ExtArgs>[]
      masteries: Prisma.$TopicMasteryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      level: number
      name: string
      slug: string
      parentId: string | null
      chapterNum: number | null
      keywords: string[]
      aliases: string[]
      expectedQuestions: number
      createdAt: Date
    }, ExtArgs["result"]["topic"]>
    composites: {}
  }

  type TopicGetPayload<S extends boolean | null | undefined | TopicDefaultArgs> = $Result.GetResult<Prisma.$TopicPayload, S>

  type TopicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TopicFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TopicCountAggregateInputType | true
    }

  export interface TopicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Topic'], meta: { name: 'Topic' } }
    /**
     * Find zero or one Topic that matches the filter.
     * @param {TopicFindUniqueArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicFindUniqueArgs>(args: SelectSubset<T, TopicFindUniqueArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Topic that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TopicFindUniqueOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Topic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicFindFirstArgs>(args?: SelectSubset<T, TopicFindFirstArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Topic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Topics
     * const topics = await prisma.topic.findMany()
     * 
     * // Get first 10 Topics
     * const topics = await prisma.topic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicWithIdOnly = await prisma.topic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicFindManyArgs>(args?: SelectSubset<T, TopicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Topic.
     * @param {TopicCreateArgs} args - Arguments to create a Topic.
     * @example
     * // Create one Topic
     * const Topic = await prisma.topic.create({
     *   data: {
     *     // ... data to create a Topic
     *   }
     * })
     * 
     */
    create<T extends TopicCreateArgs>(args: SelectSubset<T, TopicCreateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Topics.
     * @param {TopicCreateManyArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicCreateManyArgs>(args?: SelectSubset<T, TopicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Topics and returns the data saved in the database.
     * @param {TopicCreateManyAndReturnArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Topics and only return the `id`
     * const topicWithIdOnly = await prisma.topic.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Topic.
     * @param {TopicDeleteArgs} args - Arguments to delete one Topic.
     * @example
     * // Delete one Topic
     * const Topic = await prisma.topic.delete({
     *   where: {
     *     // ... filter to delete one Topic
     *   }
     * })
     * 
     */
    delete<T extends TopicDeleteArgs>(args: SelectSubset<T, TopicDeleteArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Topic.
     * @param {TopicUpdateArgs} args - Arguments to update one Topic.
     * @example
     * // Update one Topic
     * const topic = await prisma.topic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicUpdateArgs>(args: SelectSubset<T, TopicUpdateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Topics.
     * @param {TopicDeleteManyArgs} args - Arguments to filter Topics to delete.
     * @example
     * // Delete a few Topics
     * const { count } = await prisma.topic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicDeleteManyArgs>(args?: SelectSubset<T, TopicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicUpdateManyArgs>(args: SelectSubset<T, TopicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Topic.
     * @param {TopicUpsertArgs} args - Arguments to update or create a Topic.
     * @example
     * // Update or create a Topic
     * const topic = await prisma.topic.upsert({
     *   create: {
     *     // ... data to create a Topic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Topic we want to update
     *   }
     * })
     */
    upsert<T extends TopicUpsertArgs>(args: SelectSubset<T, TopicUpsertArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountArgs} args - Arguments to filter Topics to count.
     * @example
     * // Count the number of Topics
     * const count = await prisma.topic.count({
     *   where: {
     *     // ... the filter for the Topics we want to count
     *   }
     * })
    **/
    count<T extends TopicCountArgs>(
      args?: Subset<T, TopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicAggregateArgs>(args: Subset<T, TopicAggregateArgs>): Prisma.PrismaPromise<GetTopicAggregateType<T>>

    /**
     * Group by Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicGroupByArgs['orderBy'] }
        : { orderBy?: TopicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Topic model
   */
  readonly fields: TopicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Topic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parent<T extends Topic$parentArgs<ExtArgs> = {}>(args?: Subset<T, Topic$parentArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    children<T extends Topic$childrenArgs<ExtArgs> = {}>(args?: Subset<T, Topic$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany"> | Null>
    interactions<T extends Topic$interactionsArgs<ExtArgs> = {}>(args?: Subset<T, Topic$interactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findMany"> | Null>
    masteries<T extends Topic$masteriesArgs<ExtArgs> = {}>(args?: Subset<T, Topic$masteriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Topic model
   */ 
  interface TopicFieldRefs {
    readonly id: FieldRef<"Topic", 'String'>
    readonly level: FieldRef<"Topic", 'Int'>
    readonly name: FieldRef<"Topic", 'String'>
    readonly slug: FieldRef<"Topic", 'String'>
    readonly parentId: FieldRef<"Topic", 'String'>
    readonly chapterNum: FieldRef<"Topic", 'Int'>
    readonly keywords: FieldRef<"Topic", 'String[]'>
    readonly aliases: FieldRef<"Topic", 'String[]'>
    readonly expectedQuestions: FieldRef<"Topic", 'Int'>
    readonly createdAt: FieldRef<"Topic", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Topic findUnique
   */
  export type TopicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findUniqueOrThrow
   */
  export type TopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findFirst
   */
  export type TopicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findFirstOrThrow
   */
  export type TopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findMany
   */
  export type TopicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topics to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic create
   */
  export type TopicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to create a Topic.
     */
    data: XOR<TopicCreateInput, TopicUncheckedCreateInput>
  }

  /**
   * Topic createMany
   */
  export type TopicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Topic createManyAndReturn
   */
  export type TopicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Topic update
   */
  export type TopicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to update a Topic.
     */
    data: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
    /**
     * Choose, which Topic to update.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic updateMany
   */
  export type TopicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
  }

  /**
   * Topic upsert
   */
  export type TopicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The filter to search for the Topic to update in case it exists.
     */
    where: TopicWhereUniqueInput
    /**
     * In case the Topic found by the `where` argument doesn't exist, create a new Topic with this data.
     */
    create: XOR<TopicCreateInput, TopicUncheckedCreateInput>
    /**
     * In case the Topic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
  }

  /**
   * Topic delete
   */
  export type TopicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter which Topic to delete.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic deleteMany
   */
  export type TopicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topics to delete
     */
    where?: TopicWhereInput
  }

  /**
   * Topic.parent
   */
  export type Topic$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    where?: TopicWhereInput
  }

  /**
   * Topic.children
   */
  export type Topic$childrenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    cursor?: TopicWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic.interactions
   */
  export type Topic$interactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    where?: TopicInteractionWhereInput
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    cursor?: TopicInteractionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicInteractionScalarFieldEnum | TopicInteractionScalarFieldEnum[]
  }

  /**
   * Topic.masteries
   */
  export type Topic$masteriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    where?: TopicMasteryWhereInput
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    cursor?: TopicMasteryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicMasteryScalarFieldEnum | TopicMasteryScalarFieldEnum[]
  }

  /**
   * Topic without action
   */
  export type TopicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
  }


  /**
   * Model TopicInteraction
   */

  export type AggregateTopicInteraction = {
    _count: TopicInteractionCountAggregateOutputType | null
    _avg: TopicInteractionAvgAggregateOutputType | null
    _sum: TopicInteractionSumAggregateOutputType | null
    _min: TopicInteractionMinAggregateOutputType | null
    _max: TopicInteractionMaxAggregateOutputType | null
  }

  export type TopicInteractionAvgAggregateOutputType = {
    mappingConfidence: number | null
    ragTopScore: number | null
    answerLength: number | null
    citationCount: number | null
    timeSpentMs: number | null
  }

  export type TopicInteractionSumAggregateOutputType = {
    mappingConfidence: number | null
    ragTopScore: number | null
    answerLength: number | null
    citationCount: number | null
    timeSpentMs: number | null
  }

  export type TopicInteractionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    query: string | null
    mappingConfidence: number | null
    ragConfidence: string | null
    ragTopScore: number | null
    answerLength: number | null
    citationCount: number | null
    timeSpentMs: number | null
    hadFollowUp: boolean | null
    createdAt: Date | null
  }

  export type TopicInteractionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    query: string | null
    mappingConfidence: number | null
    ragConfidence: string | null
    ragTopScore: number | null
    answerLength: number | null
    citationCount: number | null
    timeSpentMs: number | null
    hadFollowUp: boolean | null
    createdAt: Date | null
  }

  export type TopicInteractionCountAggregateOutputType = {
    id: number
    userId: number
    topicId: number
    query: number
    mappingConfidence: number
    ragConfidence: number
    ragTopScore: number
    citedSections: number
    answerLength: number
    citationCount: number
    timeSpentMs: number
    hadFollowUp: number
    createdAt: number
    _all: number
  }


  export type TopicInteractionAvgAggregateInputType = {
    mappingConfidence?: true
    ragTopScore?: true
    answerLength?: true
    citationCount?: true
    timeSpentMs?: true
  }

  export type TopicInteractionSumAggregateInputType = {
    mappingConfidence?: true
    ragTopScore?: true
    answerLength?: true
    citationCount?: true
    timeSpentMs?: true
  }

  export type TopicInteractionMinAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    query?: true
    mappingConfidence?: true
    ragConfidence?: true
    ragTopScore?: true
    answerLength?: true
    citationCount?: true
    timeSpentMs?: true
    hadFollowUp?: true
    createdAt?: true
  }

  export type TopicInteractionMaxAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    query?: true
    mappingConfidence?: true
    ragConfidence?: true
    ragTopScore?: true
    answerLength?: true
    citationCount?: true
    timeSpentMs?: true
    hadFollowUp?: true
    createdAt?: true
  }

  export type TopicInteractionCountAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    query?: true
    mappingConfidence?: true
    ragConfidence?: true
    ragTopScore?: true
    citedSections?: true
    answerLength?: true
    citationCount?: true
    timeSpentMs?: true
    hadFollowUp?: true
    createdAt?: true
    _all?: true
  }

  export type TopicInteractionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicInteraction to aggregate.
     */
    where?: TopicInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicInteractions to fetch.
     */
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicInteractions
    **/
    _count?: true | TopicInteractionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicInteractionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicInteractionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicInteractionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicInteractionMaxAggregateInputType
  }

  export type GetTopicInteractionAggregateType<T extends TopicInteractionAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicInteraction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicInteraction[P]>
      : GetScalarType<T[P], AggregateTopicInteraction[P]>
  }




  export type TopicInteractionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicInteractionWhereInput
    orderBy?: TopicInteractionOrderByWithAggregationInput | TopicInteractionOrderByWithAggregationInput[]
    by: TopicInteractionScalarFieldEnum[] | TopicInteractionScalarFieldEnum
    having?: TopicInteractionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicInteractionCountAggregateInputType | true
    _avg?: TopicInteractionAvgAggregateInputType
    _sum?: TopicInteractionSumAggregateInputType
    _min?: TopicInteractionMinAggregateInputType
    _max?: TopicInteractionMaxAggregateInputType
  }

  export type TopicInteractionGroupByOutputType = {
    id: string
    userId: string
    topicId: string
    query: string
    mappingConfidence: number
    ragConfidence: string
    ragTopScore: number
    citedSections: string[]
    answerLength: number
    citationCount: number
    timeSpentMs: number | null
    hadFollowUp: boolean
    createdAt: Date
    _count: TopicInteractionCountAggregateOutputType | null
    _avg: TopicInteractionAvgAggregateOutputType | null
    _sum: TopicInteractionSumAggregateOutputType | null
    _min: TopicInteractionMinAggregateOutputType | null
    _max: TopicInteractionMaxAggregateOutputType | null
  }

  type GetTopicInteractionGroupByPayload<T extends TopicInteractionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicInteractionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicInteractionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicInteractionGroupByOutputType[P]>
            : GetScalarType<T[P], TopicInteractionGroupByOutputType[P]>
        }
      >
    >


  export type TopicInteractionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    query?: boolean
    mappingConfidence?: boolean
    ragConfidence?: boolean
    ragTopScore?: boolean
    citedSections?: boolean
    answerLength?: boolean
    citationCount?: boolean
    timeSpentMs?: boolean
    hadFollowUp?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicInteraction"]>


  export type TopicInteractionSelectScalar = {
    id?: boolean
    userId?: boolean
    topicId?: boolean
    query?: boolean
    mappingConfidence?: boolean
    ragConfidence?: boolean
    ragTopScore?: boolean
    citedSections?: boolean
    answerLength?: boolean
    citationCount?: boolean
    timeSpentMs?: boolean
    hadFollowUp?: boolean
    createdAt?: boolean
  }

  export type TopicInteractionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $TopicInteractionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicInteraction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      topic: Prisma.$TopicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      topicId: string
      query: string
      mappingConfidence: number
      ragConfidence: string
      ragTopScore: number
      citedSections: string[]
      answerLength: number
      citationCount: number
      timeSpentMs: number | null
      hadFollowUp: boolean
      createdAt: Date
    }, ExtArgs["result"]["topicInteraction"]>
    composites: {}
  }

  type TopicInteractionGetPayload<S extends boolean | null | undefined | TopicInteractionDefaultArgs> = $Result.GetResult<Prisma.$TopicInteractionPayload, S>

  type TopicInteractionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TopicInteractionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TopicInteractionCountAggregateInputType | true
    }

  export interface TopicInteractionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicInteraction'], meta: { name: 'TopicInteraction' } }
    /**
     * Find zero or one TopicInteraction that matches the filter.
     * @param {TopicInteractionFindUniqueArgs} args - Arguments to find a TopicInteraction
     * @example
     * // Get one TopicInteraction
     * const topicInteraction = await prisma.topicInteraction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicInteractionFindUniqueArgs>(args: SelectSubset<T, TopicInteractionFindUniqueArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TopicInteraction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TopicInteractionFindUniqueOrThrowArgs} args - Arguments to find a TopicInteraction
     * @example
     * // Get one TopicInteraction
     * const topicInteraction = await prisma.topicInteraction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicInteractionFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicInteractionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TopicInteraction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionFindFirstArgs} args - Arguments to find a TopicInteraction
     * @example
     * // Get one TopicInteraction
     * const topicInteraction = await prisma.topicInteraction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicInteractionFindFirstArgs>(args?: SelectSubset<T, TopicInteractionFindFirstArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TopicInteraction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionFindFirstOrThrowArgs} args - Arguments to find a TopicInteraction
     * @example
     * // Get one TopicInteraction
     * const topicInteraction = await prisma.topicInteraction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicInteractionFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicInteractionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TopicInteractions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicInteractions
     * const topicInteractions = await prisma.topicInteraction.findMany()
     * 
     * // Get first 10 TopicInteractions
     * const topicInteractions = await prisma.topicInteraction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicInteractionWithIdOnly = await prisma.topicInteraction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicInteractionFindManyArgs>(args?: SelectSubset<T, TopicInteractionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "findMany">>

    /**
     * Delete a TopicInteraction.
     * @param {TopicInteractionDeleteArgs} args - Arguments to delete one TopicInteraction.
     * @example
     * // Delete one TopicInteraction
     * const TopicInteraction = await prisma.topicInteraction.delete({
     *   where: {
     *     // ... filter to delete one TopicInteraction
     *   }
     * })
     * 
     */
    delete<T extends TopicInteractionDeleteArgs>(args: SelectSubset<T, TopicInteractionDeleteArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TopicInteraction.
     * @param {TopicInteractionUpdateArgs} args - Arguments to update one TopicInteraction.
     * @example
     * // Update one TopicInteraction
     * const topicInteraction = await prisma.topicInteraction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicInteractionUpdateArgs>(args: SelectSubset<T, TopicInteractionUpdateArgs<ExtArgs>>): Prisma__TopicInteractionClient<$Result.GetResult<Prisma.$TopicInteractionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TopicInteractions.
     * @param {TopicInteractionDeleteManyArgs} args - Arguments to filter TopicInteractions to delete.
     * @example
     * // Delete a few TopicInteractions
     * const { count } = await prisma.topicInteraction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicInteractionDeleteManyArgs>(args?: SelectSubset<T, TopicInteractionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicInteractions
     * const topicInteraction = await prisma.topicInteraction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicInteractionUpdateManyArgs>(args: SelectSubset<T, TopicInteractionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>


    /**
     * Count the number of TopicInteractions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionCountArgs} args - Arguments to filter TopicInteractions to count.
     * @example
     * // Count the number of TopicInteractions
     * const count = await prisma.topicInteraction.count({
     *   where: {
     *     // ... the filter for the TopicInteractions we want to count
     *   }
     * })
    **/
    count<T extends TopicInteractionCountArgs>(
      args?: Subset<T, TopicInteractionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicInteractionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicInteractionAggregateArgs>(args: Subset<T, TopicInteractionAggregateArgs>): Prisma.PrismaPromise<GetTopicInteractionAggregateType<T>>

    /**
     * Group by TopicInteraction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicInteractionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicInteractionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicInteractionGroupByArgs['orderBy'] }
        : { orderBy?: TopicInteractionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicInteractionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicInteractionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicInteraction model
   */
  readonly fields: TopicInteractionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicInteraction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicInteractionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TopicInteraction model
   */ 
  interface TopicInteractionFieldRefs {
    readonly id: FieldRef<"TopicInteraction", 'String'>
    readonly userId: FieldRef<"TopicInteraction", 'String'>
    readonly topicId: FieldRef<"TopicInteraction", 'String'>
    readonly query: FieldRef<"TopicInteraction", 'String'>
    readonly mappingConfidence: FieldRef<"TopicInteraction", 'Float'>
    readonly ragConfidence: FieldRef<"TopicInteraction", 'String'>
    readonly ragTopScore: FieldRef<"TopicInteraction", 'Float'>
    readonly citedSections: FieldRef<"TopicInteraction", 'String[]'>
    readonly answerLength: FieldRef<"TopicInteraction", 'Int'>
    readonly citationCount: FieldRef<"TopicInteraction", 'Int'>
    readonly timeSpentMs: FieldRef<"TopicInteraction", 'Int'>
    readonly hadFollowUp: FieldRef<"TopicInteraction", 'Boolean'>
    readonly createdAt: FieldRef<"TopicInteraction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TopicInteraction findUnique
   */
  export type TopicInteractionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter, which TopicInteraction to fetch.
     */
    where: TopicInteractionWhereUniqueInput
  }

  /**
   * TopicInteraction findUniqueOrThrow
   */
  export type TopicInteractionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter, which TopicInteraction to fetch.
     */
    where: TopicInteractionWhereUniqueInput
  }

  /**
   * TopicInteraction findFirst
   */
  export type TopicInteractionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter, which TopicInteraction to fetch.
     */
    where?: TopicInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicInteractions to fetch.
     */
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicInteractions.
     */
    cursor?: TopicInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicInteractions.
     */
    distinct?: TopicInteractionScalarFieldEnum | TopicInteractionScalarFieldEnum[]
  }

  /**
   * TopicInteraction findFirstOrThrow
   */
  export type TopicInteractionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter, which TopicInteraction to fetch.
     */
    where?: TopicInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicInteractions to fetch.
     */
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicInteractions.
     */
    cursor?: TopicInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicInteractions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicInteractions.
     */
    distinct?: TopicInteractionScalarFieldEnum | TopicInteractionScalarFieldEnum[]
  }

  /**
   * TopicInteraction findMany
   */
  export type TopicInteractionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter, which TopicInteractions to fetch.
     */
    where?: TopicInteractionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicInteractions to fetch.
     */
    orderBy?: TopicInteractionOrderByWithRelationInput | TopicInteractionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicInteractions.
     */
    cursor?: TopicInteractionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicInteractions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicInteractions.
     */
    skip?: number
    distinct?: TopicInteractionScalarFieldEnum | TopicInteractionScalarFieldEnum[]
  }

  /**
   * TopicInteraction update
   */
  export type TopicInteractionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * The data needed to update a TopicInteraction.
     */
    data: XOR<TopicInteractionUpdateInput, TopicInteractionUncheckedUpdateInput>
    /**
     * Choose, which TopicInteraction to update.
     */
    where: TopicInteractionWhereUniqueInput
  }

  /**
   * TopicInteraction updateMany
   */
  export type TopicInteractionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicInteractions.
     */
    data: XOR<TopicInteractionUpdateManyMutationInput, TopicInteractionUncheckedUpdateManyInput>
    /**
     * Filter which TopicInteractions to update
     */
    where?: TopicInteractionWhereInput
  }

  /**
   * TopicInteraction delete
   */
  export type TopicInteractionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
    /**
     * Filter which TopicInteraction to delete.
     */
    where: TopicInteractionWhereUniqueInput
  }

  /**
   * TopicInteraction deleteMany
   */
  export type TopicInteractionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicInteractions to delete
     */
    where?: TopicInteractionWhereInput
  }

  /**
   * TopicInteraction without action
   */
  export type TopicInteractionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicInteraction
     */
    select?: TopicInteractionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInteractionInclude<ExtArgs> | null
  }


  /**
   * Model TopicMastery
   */

  export type AggregateTopicMastery = {
    _count: TopicMasteryCountAggregateOutputType | null
    _avg: TopicMasteryAvgAggregateOutputType | null
    _sum: TopicMasterySumAggregateOutputType | null
    _min: TopicMasteryMinAggregateOutputType | null
    _max: TopicMasteryMaxAggregateOutputType | null
  }

  export type TopicMasteryAvgAggregateOutputType = {
    masteryLevel: number | null
    questionsAsked: number | null
    coverageScore: number | null
    depthScore: number | null
    confidenceScore: number | null
    diversityScore: number | null
    retentionScore: number | null
  }

  export type TopicMasterySumAggregateOutputType = {
    masteryLevel: number | null
    questionsAsked: number | null
    coverageScore: number | null
    depthScore: number | null
    confidenceScore: number | null
    diversityScore: number | null
    retentionScore: number | null
  }

  export type TopicMasteryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    masteryLevel: number | null
    status: $Enums.MasteryStatus | null
    questionsAsked: number | null
    coverageScore: number | null
    depthScore: number | null
    confidenceScore: number | null
    diversityScore: number | null
    retentionScore: number | null
    firstInteraction: Date | null
    lastInteraction: Date | null
    completedAt: Date | null
    updatedAt: Date | null
  }

  export type TopicMasteryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    topicId: string | null
    masteryLevel: number | null
    status: $Enums.MasteryStatus | null
    questionsAsked: number | null
    coverageScore: number | null
    depthScore: number | null
    confidenceScore: number | null
    diversityScore: number | null
    retentionScore: number | null
    firstInteraction: Date | null
    lastInteraction: Date | null
    completedAt: Date | null
    updatedAt: Date | null
  }

  export type TopicMasteryCountAggregateOutputType = {
    id: number
    userId: number
    topicId: number
    masteryLevel: number
    status: number
    questionsAsked: number
    coverageScore: number
    depthScore: number
    confidenceScore: number
    diversityScore: number
    retentionScore: number
    subtopicsExplored: number
    firstInteraction: number
    lastInteraction: number
    completedAt: number
    updatedAt: number
    _all: number
  }


  export type TopicMasteryAvgAggregateInputType = {
    masteryLevel?: true
    questionsAsked?: true
    coverageScore?: true
    depthScore?: true
    confidenceScore?: true
    diversityScore?: true
    retentionScore?: true
  }

  export type TopicMasterySumAggregateInputType = {
    masteryLevel?: true
    questionsAsked?: true
    coverageScore?: true
    depthScore?: true
    confidenceScore?: true
    diversityScore?: true
    retentionScore?: true
  }

  export type TopicMasteryMinAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    masteryLevel?: true
    status?: true
    questionsAsked?: true
    coverageScore?: true
    depthScore?: true
    confidenceScore?: true
    diversityScore?: true
    retentionScore?: true
    firstInteraction?: true
    lastInteraction?: true
    completedAt?: true
    updatedAt?: true
  }

  export type TopicMasteryMaxAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    masteryLevel?: true
    status?: true
    questionsAsked?: true
    coverageScore?: true
    depthScore?: true
    confidenceScore?: true
    diversityScore?: true
    retentionScore?: true
    firstInteraction?: true
    lastInteraction?: true
    completedAt?: true
    updatedAt?: true
  }

  export type TopicMasteryCountAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    masteryLevel?: true
    status?: true
    questionsAsked?: true
    coverageScore?: true
    depthScore?: true
    confidenceScore?: true
    diversityScore?: true
    retentionScore?: true
    subtopicsExplored?: true
    firstInteraction?: true
    lastInteraction?: true
    completedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TopicMasteryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicMastery to aggregate.
     */
    where?: TopicMasteryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicMasteries to fetch.
     */
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicMasteryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicMasteries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicMasteries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicMasteries
    **/
    _count?: true | TopicMasteryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicMasteryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicMasterySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicMasteryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicMasteryMaxAggregateInputType
  }

  export type GetTopicMasteryAggregateType<T extends TopicMasteryAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicMastery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicMastery[P]>
      : GetScalarType<T[P], AggregateTopicMastery[P]>
  }




  export type TopicMasteryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicMasteryWhereInput
    orderBy?: TopicMasteryOrderByWithAggregationInput | TopicMasteryOrderByWithAggregationInput[]
    by: TopicMasteryScalarFieldEnum[] | TopicMasteryScalarFieldEnum
    having?: TopicMasteryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicMasteryCountAggregateInputType | true
    _avg?: TopicMasteryAvgAggregateInputType
    _sum?: TopicMasterySumAggregateInputType
    _min?: TopicMasteryMinAggregateInputType
    _max?: TopicMasteryMaxAggregateInputType
  }

  export type TopicMasteryGroupByOutputType = {
    id: string
    userId: string
    topicId: string
    masteryLevel: number
    status: $Enums.MasteryStatus
    questionsAsked: number
    coverageScore: number
    depthScore: number
    confidenceScore: number
    diversityScore: number
    retentionScore: number
    subtopicsExplored: string[]
    firstInteraction: Date | null
    lastInteraction: Date | null
    completedAt: Date | null
    updatedAt: Date
    _count: TopicMasteryCountAggregateOutputType | null
    _avg: TopicMasteryAvgAggregateOutputType | null
    _sum: TopicMasterySumAggregateOutputType | null
    _min: TopicMasteryMinAggregateOutputType | null
    _max: TopicMasteryMaxAggregateOutputType | null
  }

  type GetTopicMasteryGroupByPayload<T extends TopicMasteryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicMasteryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicMasteryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicMasteryGroupByOutputType[P]>
            : GetScalarType<T[P], TopicMasteryGroupByOutputType[P]>
        }
      >
    >


  export type TopicMasterySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    masteryLevel?: boolean
    status?: boolean
    questionsAsked?: boolean
    coverageScore?: boolean
    depthScore?: boolean
    confidenceScore?: boolean
    diversityScore?: boolean
    retentionScore?: boolean
    subtopicsExplored?: boolean
    firstInteraction?: boolean
    lastInteraction?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicMastery"]>

  export type TopicMasterySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    masteryLevel?: boolean
    status?: boolean
    questionsAsked?: boolean
    coverageScore?: boolean
    depthScore?: boolean
    confidenceScore?: boolean
    diversityScore?: boolean
    retentionScore?: boolean
    subtopicsExplored?: boolean
    firstInteraction?: boolean
    lastInteraction?: boolean
    completedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicMastery"]>

  export type TopicMasterySelectScalar = {
    id?: boolean
    userId?: boolean
    topicId?: boolean
    masteryLevel?: boolean
    status?: boolean
    questionsAsked?: boolean
    coverageScore?: boolean
    depthScore?: boolean
    confidenceScore?: boolean
    diversityScore?: boolean
    retentionScore?: boolean
    subtopicsExplored?: boolean
    firstInteraction?: boolean
    lastInteraction?: boolean
    completedAt?: boolean
    updatedAt?: boolean
  }

  export type TopicMasteryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type TopicMasteryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $TopicMasteryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicMastery"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      topic: Prisma.$TopicPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      topicId: string
      masteryLevel: number
      status: $Enums.MasteryStatus
      questionsAsked: number
      coverageScore: number
      depthScore: number
      confidenceScore: number
      diversityScore: number
      retentionScore: number
      subtopicsExplored: string[]
      firstInteraction: Date | null
      lastInteraction: Date | null
      completedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["topicMastery"]>
    composites: {}
  }

  type TopicMasteryGetPayload<S extends boolean | null | undefined | TopicMasteryDefaultArgs> = $Result.GetResult<Prisma.$TopicMasteryPayload, S>

  type TopicMasteryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TopicMasteryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TopicMasteryCountAggregateInputType | true
    }

  export interface TopicMasteryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicMastery'], meta: { name: 'TopicMastery' } }
    /**
     * Find zero or one TopicMastery that matches the filter.
     * @param {TopicMasteryFindUniqueArgs} args - Arguments to find a TopicMastery
     * @example
     * // Get one TopicMastery
     * const topicMastery = await prisma.topicMastery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicMasteryFindUniqueArgs>(args: SelectSubset<T, TopicMasteryFindUniqueArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TopicMastery that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TopicMasteryFindUniqueOrThrowArgs} args - Arguments to find a TopicMastery
     * @example
     * // Get one TopicMastery
     * const topicMastery = await prisma.topicMastery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicMasteryFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicMasteryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TopicMastery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryFindFirstArgs} args - Arguments to find a TopicMastery
     * @example
     * // Get one TopicMastery
     * const topicMastery = await prisma.topicMastery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicMasteryFindFirstArgs>(args?: SelectSubset<T, TopicMasteryFindFirstArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TopicMastery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryFindFirstOrThrowArgs} args - Arguments to find a TopicMastery
     * @example
     * // Get one TopicMastery
     * const topicMastery = await prisma.topicMastery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicMasteryFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicMasteryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TopicMasteries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicMasteries
     * const topicMasteries = await prisma.topicMastery.findMany()
     * 
     * // Get first 10 TopicMasteries
     * const topicMasteries = await prisma.topicMastery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicMasteryWithIdOnly = await prisma.topicMastery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicMasteryFindManyArgs>(args?: SelectSubset<T, TopicMasteryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TopicMastery.
     * @param {TopicMasteryCreateArgs} args - Arguments to create a TopicMastery.
     * @example
     * // Create one TopicMastery
     * const TopicMastery = await prisma.topicMastery.create({
     *   data: {
     *     // ... data to create a TopicMastery
     *   }
     * })
     * 
     */
    create<T extends TopicMasteryCreateArgs>(args: SelectSubset<T, TopicMasteryCreateArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TopicMasteries.
     * @param {TopicMasteryCreateManyArgs} args - Arguments to create many TopicMasteries.
     * @example
     * // Create many TopicMasteries
     * const topicMastery = await prisma.topicMastery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicMasteryCreateManyArgs>(args?: SelectSubset<T, TopicMasteryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TopicMasteries and returns the data saved in the database.
     * @param {TopicMasteryCreateManyAndReturnArgs} args - Arguments to create many TopicMasteries.
     * @example
     * // Create many TopicMasteries
     * const topicMastery = await prisma.topicMastery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TopicMasteries and only return the `id`
     * const topicMasteryWithIdOnly = await prisma.topicMastery.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicMasteryCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicMasteryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TopicMastery.
     * @param {TopicMasteryDeleteArgs} args - Arguments to delete one TopicMastery.
     * @example
     * // Delete one TopicMastery
     * const TopicMastery = await prisma.topicMastery.delete({
     *   where: {
     *     // ... filter to delete one TopicMastery
     *   }
     * })
     * 
     */
    delete<T extends TopicMasteryDeleteArgs>(args: SelectSubset<T, TopicMasteryDeleteArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TopicMastery.
     * @param {TopicMasteryUpdateArgs} args - Arguments to update one TopicMastery.
     * @example
     * // Update one TopicMastery
     * const topicMastery = await prisma.topicMastery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicMasteryUpdateArgs>(args: SelectSubset<T, TopicMasteryUpdateArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TopicMasteries.
     * @param {TopicMasteryDeleteManyArgs} args - Arguments to filter TopicMasteries to delete.
     * @example
     * // Delete a few TopicMasteries
     * const { count } = await prisma.topicMastery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicMasteryDeleteManyArgs>(args?: SelectSubset<T, TopicMasteryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicMasteries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicMasteries
     * const topicMastery = await prisma.topicMastery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicMasteryUpdateManyArgs>(args: SelectSubset<T, TopicMasteryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TopicMastery.
     * @param {TopicMasteryUpsertArgs} args - Arguments to update or create a TopicMastery.
     * @example
     * // Update or create a TopicMastery
     * const topicMastery = await prisma.topicMastery.upsert({
     *   create: {
     *     // ... data to create a TopicMastery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TopicMastery we want to update
     *   }
     * })
     */
    upsert<T extends TopicMasteryUpsertArgs>(args: SelectSubset<T, TopicMasteryUpsertArgs<ExtArgs>>): Prisma__TopicMasteryClient<$Result.GetResult<Prisma.$TopicMasteryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TopicMasteries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryCountArgs} args - Arguments to filter TopicMasteries to count.
     * @example
     * // Count the number of TopicMasteries
     * const count = await prisma.topicMastery.count({
     *   where: {
     *     // ... the filter for the TopicMasteries we want to count
     *   }
     * })
    **/
    count<T extends TopicMasteryCountArgs>(
      args?: Subset<T, TopicMasteryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicMasteryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicMastery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicMasteryAggregateArgs>(args: Subset<T, TopicMasteryAggregateArgs>): Prisma.PrismaPromise<GetTopicMasteryAggregateType<T>>

    /**
     * Group by TopicMastery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicMasteryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicMasteryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicMasteryGroupByArgs['orderBy'] }
        : { orderBy?: TopicMasteryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicMasteryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicMasteryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicMastery model
   */
  readonly fields: TopicMasteryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicMastery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicMasteryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TopicMastery model
   */ 
  interface TopicMasteryFieldRefs {
    readonly id: FieldRef<"TopicMastery", 'String'>
    readonly userId: FieldRef<"TopicMastery", 'String'>
    readonly topicId: FieldRef<"TopicMastery", 'String'>
    readonly masteryLevel: FieldRef<"TopicMastery", 'Float'>
    readonly status: FieldRef<"TopicMastery", 'MasteryStatus'>
    readonly questionsAsked: FieldRef<"TopicMastery", 'Int'>
    readonly coverageScore: FieldRef<"TopicMastery", 'Float'>
    readonly depthScore: FieldRef<"TopicMastery", 'Float'>
    readonly confidenceScore: FieldRef<"TopicMastery", 'Float'>
    readonly diversityScore: FieldRef<"TopicMastery", 'Float'>
    readonly retentionScore: FieldRef<"TopicMastery", 'Float'>
    readonly subtopicsExplored: FieldRef<"TopicMastery", 'String[]'>
    readonly firstInteraction: FieldRef<"TopicMastery", 'DateTime'>
    readonly lastInteraction: FieldRef<"TopicMastery", 'DateTime'>
    readonly completedAt: FieldRef<"TopicMastery", 'DateTime'>
    readonly updatedAt: FieldRef<"TopicMastery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TopicMastery findUnique
   */
  export type TopicMasteryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter, which TopicMastery to fetch.
     */
    where: TopicMasteryWhereUniqueInput
  }

  /**
   * TopicMastery findUniqueOrThrow
   */
  export type TopicMasteryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter, which TopicMastery to fetch.
     */
    where: TopicMasteryWhereUniqueInput
  }

  /**
   * TopicMastery findFirst
   */
  export type TopicMasteryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter, which TopicMastery to fetch.
     */
    where?: TopicMasteryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicMasteries to fetch.
     */
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicMasteries.
     */
    cursor?: TopicMasteryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicMasteries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicMasteries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicMasteries.
     */
    distinct?: TopicMasteryScalarFieldEnum | TopicMasteryScalarFieldEnum[]
  }

  /**
   * TopicMastery findFirstOrThrow
   */
  export type TopicMasteryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter, which TopicMastery to fetch.
     */
    where?: TopicMasteryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicMasteries to fetch.
     */
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicMasteries.
     */
    cursor?: TopicMasteryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicMasteries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicMasteries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicMasteries.
     */
    distinct?: TopicMasteryScalarFieldEnum | TopicMasteryScalarFieldEnum[]
  }

  /**
   * TopicMastery findMany
   */
  export type TopicMasteryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter, which TopicMasteries to fetch.
     */
    where?: TopicMasteryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicMasteries to fetch.
     */
    orderBy?: TopicMasteryOrderByWithRelationInput | TopicMasteryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicMasteries.
     */
    cursor?: TopicMasteryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicMasteries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicMasteries.
     */
    skip?: number
    distinct?: TopicMasteryScalarFieldEnum | TopicMasteryScalarFieldEnum[]
  }

  /**
   * TopicMastery create
   */
  export type TopicMasteryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * The data needed to create a TopicMastery.
     */
    data: XOR<TopicMasteryCreateInput, TopicMasteryUncheckedCreateInput>
  }

  /**
   * TopicMastery createMany
   */
  export type TopicMasteryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TopicMasteries.
     */
    data: TopicMasteryCreateManyInput | TopicMasteryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TopicMastery createManyAndReturn
   */
  export type TopicMasteryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TopicMasteries.
     */
    data: TopicMasteryCreateManyInput | TopicMasteryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicMastery update
   */
  export type TopicMasteryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * The data needed to update a TopicMastery.
     */
    data: XOR<TopicMasteryUpdateInput, TopicMasteryUncheckedUpdateInput>
    /**
     * Choose, which TopicMastery to update.
     */
    where: TopicMasteryWhereUniqueInput
  }

  /**
   * TopicMastery updateMany
   */
  export type TopicMasteryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicMasteries.
     */
    data: XOR<TopicMasteryUpdateManyMutationInput, TopicMasteryUncheckedUpdateManyInput>
    /**
     * Filter which TopicMasteries to update
     */
    where?: TopicMasteryWhereInput
  }

  /**
   * TopicMastery upsert
   */
  export type TopicMasteryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * The filter to search for the TopicMastery to update in case it exists.
     */
    where: TopicMasteryWhereUniqueInput
    /**
     * In case the TopicMastery found by the `where` argument doesn't exist, create a new TopicMastery with this data.
     */
    create: XOR<TopicMasteryCreateInput, TopicMasteryUncheckedCreateInput>
    /**
     * In case the TopicMastery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicMasteryUpdateInput, TopicMasteryUncheckedUpdateInput>
  }

  /**
   * TopicMastery delete
   */
  export type TopicMasteryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
    /**
     * Filter which TopicMastery to delete.
     */
    where: TopicMasteryWhereUniqueInput
  }

  /**
   * TopicMastery deleteMany
   */
  export type TopicMasteryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicMasteries to delete
     */
    where?: TopicMasteryWhereInput
  }

  /**
   * TopicMastery without action
   */
  export type TopicMasteryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicMastery
     */
    select?: TopicMasterySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicMasteryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    isVerified: 'isVerified',
    failedLogins: 'failedLogins',
    lockedUntil: 'lockedUntil',
    verificationToken: 'verificationToken',
    verificationExpires: 'verificationExpires',
    resetToken: 'resetToken',
    resetTokenExpires: 'resetTokenExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const NoteScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    document: 'document',
    page: 'page',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type NoteScalarFieldEnum = (typeof NoteScalarFieldEnum)[keyof typeof NoteScalarFieldEnum]


  export const ProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    document: 'document',
    pagesRead: 'pagesRead',
    minutes: 'minutes',
    date: 'date'
  };

  export type ProgressScalarFieldEnum = (typeof ProgressScalarFieldEnum)[keyof typeof ProgressScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    filename: 'filename',
    originalName: 'originalName',
    contentHash: 'contentHash',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    status: 'status',
    isSystemDocument: 'isSystemDocument',
    totalChunks: 'totalChunks',
    processedChunks: 'processedChunks',
    processingError: 'processingError',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const EmbeddingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    documentId: 'documentId',
    source: 'source',
    chunk: 'chunk',
    embedding: 'embedding',
    documentType: 'documentType',
    chunkIndex: 'chunkIndex',
    totalChunks: 'totalChunks',
    section: 'section',
    startLine: 'startLine',
    endLine: 'endLine',
    chunkingConfig: 'chunkingConfig',
    sectionLevel: 'sectionLevel',
    pageStart: 'pageStart',
    pageEnd: 'pageEnd',
    hasTable: 'hasTable',
    hasImage: 'hasImage',
    wordCount: 'wordCount',
    createdAt: 'createdAt'
  };

  export type EmbeddingScalarFieldEnum = (typeof EmbeddingScalarFieldEnum)[keyof typeof EmbeddingScalarFieldEnum]


  export const RetrievalLogScalarFieldEnum: {
    id: 'id',
    query: 'query',
    results: 'results',
    metrics: 'metrics',
    createdAt: 'createdAt'
  };

  export type RetrievalLogScalarFieldEnum = (typeof RetrievalLogScalarFieldEnum)[keyof typeof RetrievalLogScalarFieldEnum]


  export const TopicScalarFieldEnum: {
    id: 'id',
    level: 'level',
    name: 'name',
    slug: 'slug',
    parentId: 'parentId',
    chapterNum: 'chapterNum',
    keywords: 'keywords',
    aliases: 'aliases',
    expectedQuestions: 'expectedQuestions',
    createdAt: 'createdAt'
  };

  export type TopicScalarFieldEnum = (typeof TopicScalarFieldEnum)[keyof typeof TopicScalarFieldEnum]


  export const TopicInteractionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    topicId: 'topicId',
    query: 'query',
    mappingConfidence: 'mappingConfidence',
    ragConfidence: 'ragConfidence',
    ragTopScore: 'ragTopScore',
    citedSections: 'citedSections',
    answerLength: 'answerLength',
    citationCount: 'citationCount',
    timeSpentMs: 'timeSpentMs',
    hadFollowUp: 'hadFollowUp',
    createdAt: 'createdAt'
  };

  export type TopicInteractionScalarFieldEnum = (typeof TopicInteractionScalarFieldEnum)[keyof typeof TopicInteractionScalarFieldEnum]


  export const TopicMasteryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    topicId: 'topicId',
    masteryLevel: 'masteryLevel',
    status: 'status',
    questionsAsked: 'questionsAsked',
    coverageScore: 'coverageScore',
    depthScore: 'depthScore',
    confidenceScore: 'confidenceScore',
    diversityScore: 'diversityScore',
    retentionScore: 'retentionScore',
    subtopicsExplored: 'subtopicsExplored',
    firstInteraction: 'firstInteraction',
    lastInteraction: 'lastInteraction',
    completedAt: 'completedAt',
    updatedAt: 'updatedAt'
  };

  export type TopicMasteryScalarFieldEnum = (typeof TopicMasteryScalarFieldEnum)[keyof typeof TopicMasteryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'DocumentStatus'
   */
  export type EnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus'>
    


  /**
   * Reference to a field of type 'DocumentStatus[]'
   */
  export type ListEnumDocumentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocumentStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'MasteryStatus'
   */
  export type EnumMasteryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MasteryStatus'>
    


  /**
   * Reference to a field of type 'MasteryStatus[]'
   */
  export type ListEnumMasteryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MasteryStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isVerified?: BoolFilter<"User"> | boolean
    failedLogins?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    verificationToken?: StringNullableFilter<"User"> | string | null
    verificationExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    notes?: NoteListRelationFilter
    progress?: ProgressListRelationFilter
    documents?: DocumentListRelationFilter
    embeddings?: EmbeddingListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
    topicInteractions?: TopicInteractionListRelationFilter
    topicMasteries?: TopicMasteryListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    failedLogins?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationExpires?: SortOrderInput | SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    notes?: NoteOrderByRelationAggregateInput
    progress?: ProgressOrderByRelationAggregateInput
    documents?: DocumentOrderByRelationAggregateInput
    embeddings?: EmbeddingOrderByRelationAggregateInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
    topicInteractions?: TopicInteractionOrderByRelationAggregateInput
    topicMasteries?: TopicMasteryOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    verificationToken?: string
    resetToken?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    isVerified?: BoolFilter<"User"> | boolean
    failedLogins?: IntFilter<"User"> | number
    lockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    verificationExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    resetTokenExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    notes?: NoteListRelationFilter
    progress?: ProgressListRelationFilter
    documents?: DocumentListRelationFilter
    embeddings?: EmbeddingListRelationFilter
    refreshTokens?: RefreshTokenListRelationFilter
    topicInteractions?: TopicInteractionListRelationFilter
    topicMasteries?: TopicMasteryListRelationFilter
  }, "id" | "email" | "verificationToken" | "resetToken">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    failedLogins?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    verificationToken?: SortOrderInput | SortOrder
    verificationExpires?: SortOrderInput | SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    isVerified?: BoolWithAggregatesFilter<"User"> | boolean
    failedLogins?: IntWithAggregatesFilter<"User"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    verificationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    verificationExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    resetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetTokenExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: StringWithAggregatesFilter<"RefreshToken"> | string
    token?: StringWithAggregatesFilter<"RefreshToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type NoteWhereInput = {
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    id?: StringFilter<"Note"> | string
    userId?: StringFilter<"Note"> | string
    document?: StringFilter<"Note"> | string
    page?: IntFilter<"Note"> | number
    content?: StringFilter<"Note"> | string
    createdAt?: DateTimeFilter<"Note"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NoteOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    page?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    userId?: StringFilter<"Note"> | string
    document?: StringFilter<"Note"> | string
    page?: IntFilter<"Note"> | number
    content?: StringFilter<"Note"> | string
    createdAt?: DateTimeFilter<"Note"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type NoteOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    page?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: NoteCountOrderByAggregateInput
    _avg?: NoteAvgOrderByAggregateInput
    _max?: NoteMaxOrderByAggregateInput
    _min?: NoteMinOrderByAggregateInput
    _sum?: NoteSumOrderByAggregateInput
  }

  export type NoteScalarWhereWithAggregatesInput = {
    AND?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    OR?: NoteScalarWhereWithAggregatesInput[]
    NOT?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Note"> | string
    userId?: StringWithAggregatesFilter<"Note"> | string
    document?: StringWithAggregatesFilter<"Note"> | string
    page?: IntWithAggregatesFilter<"Note"> | number
    content?: StringWithAggregatesFilter<"Note"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Note"> | Date | string
  }

  export type ProgressWhereInput = {
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    id?: StringFilter<"Progress"> | string
    userId?: StringFilter<"Progress"> | string
    document?: StringFilter<"Progress"> | string
    pagesRead?: IntFilter<"Progress"> | number
    minutes?: IntFilter<"Progress"> | number
    date?: DateTimeFilter<"Progress"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    pagesRead?: SortOrder
    minutes?: SortOrder
    date?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgressWhereInput | ProgressWhereInput[]
    OR?: ProgressWhereInput[]
    NOT?: ProgressWhereInput | ProgressWhereInput[]
    userId?: StringFilter<"Progress"> | string
    document?: StringFilter<"Progress"> | string
    pagesRead?: IntFilter<"Progress"> | number
    minutes?: IntFilter<"Progress"> | number
    date?: DateTimeFilter<"Progress"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    pagesRead?: SortOrder
    minutes?: SortOrder
    date?: SortOrder
    _count?: ProgressCountOrderByAggregateInput
    _avg?: ProgressAvgOrderByAggregateInput
    _max?: ProgressMaxOrderByAggregateInput
    _min?: ProgressMinOrderByAggregateInput
    _sum?: ProgressSumOrderByAggregateInput
  }

  export type ProgressScalarWhereWithAggregatesInput = {
    AND?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    OR?: ProgressScalarWhereWithAggregatesInput[]
    NOT?: ProgressScalarWhereWithAggregatesInput | ProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Progress"> | string
    userId?: StringWithAggregatesFilter<"Progress"> | string
    document?: StringWithAggregatesFilter<"Progress"> | string
    pagesRead?: IntWithAggregatesFilter<"Progress"> | number
    minutes?: IntWithAggregatesFilter<"Progress"> | number
    date?: DateTimeWithAggregatesFilter<"Progress"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    userId?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    originalName?: StringFilter<"Document"> | string
    contentHash?: StringFilter<"Document"> | string
    fileSize?: IntFilter<"Document"> | number
    mimeType?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    isSystemDocument?: BoolFilter<"Document"> | boolean
    totalChunks?: IntNullableFilter<"Document"> | number | null
    processedChunks?: IntFilter<"Document"> | number
    processingError?: StringNullableFilter<"Document"> | string | null
    startedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    embeddings?: EmbeddingListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    contentHash?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    status?: SortOrder
    isSystemDocument?: SortOrder
    totalChunks?: SortOrderInput | SortOrder
    processedChunks?: SortOrder
    processingError?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    embeddings?: EmbeddingOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    contentHash?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    userId?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    originalName?: StringFilter<"Document"> | string
    fileSize?: IntFilter<"Document"> | number
    mimeType?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    isSystemDocument?: BoolFilter<"Document"> | boolean
    totalChunks?: IntNullableFilter<"Document"> | number | null
    processedChunks?: IntFilter<"Document"> | number
    processingError?: StringNullableFilter<"Document"> | string | null
    startedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    embeddings?: EmbeddingListRelationFilter
  }, "id" | "contentHash">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    contentHash?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrderInput | SortOrder
    status?: SortOrder
    isSystemDocument?: SortOrder
    totalChunks?: SortOrderInput | SortOrder
    processedChunks?: SortOrder
    processingError?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    userId?: StringWithAggregatesFilter<"Document"> | string
    filename?: StringWithAggregatesFilter<"Document"> | string
    originalName?: StringWithAggregatesFilter<"Document"> | string
    contentHash?: StringWithAggregatesFilter<"Document"> | string
    fileSize?: IntWithAggregatesFilter<"Document"> | number
    mimeType?: StringNullableWithAggregatesFilter<"Document"> | string | null
    status?: EnumDocumentStatusWithAggregatesFilter<"Document"> | $Enums.DocumentStatus
    isSystemDocument?: BoolWithAggregatesFilter<"Document"> | boolean
    totalChunks?: IntNullableWithAggregatesFilter<"Document"> | number | null
    processedChunks?: IntWithAggregatesFilter<"Document"> | number
    processingError?: StringNullableWithAggregatesFilter<"Document"> | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"Document"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Document"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type EmbeddingWhereInput = {
    AND?: EmbeddingWhereInput | EmbeddingWhereInput[]
    OR?: EmbeddingWhereInput[]
    NOT?: EmbeddingWhereInput | EmbeddingWhereInput[]
    id?: StringFilter<"Embedding"> | string
    userId?: StringNullableFilter<"Embedding"> | string | null
    documentId?: StringNullableFilter<"Embedding"> | string | null
    source?: StringFilter<"Embedding"> | string
    chunk?: StringFilter<"Embedding"> | string
    embedding?: JsonFilter<"Embedding">
    documentType?: StringNullableFilter<"Embedding"> | string | null
    chunkIndex?: IntNullableFilter<"Embedding"> | number | null
    totalChunks?: IntNullableFilter<"Embedding"> | number | null
    section?: StringNullableFilter<"Embedding"> | string | null
    startLine?: IntNullableFilter<"Embedding"> | number | null
    endLine?: IntNullableFilter<"Embedding"> | number | null
    chunkingConfig?: JsonNullableFilter<"Embedding">
    sectionLevel?: IntNullableFilter<"Embedding"> | number | null
    pageStart?: IntNullableFilter<"Embedding"> | number | null
    pageEnd?: IntNullableFilter<"Embedding"> | number | null
    hasTable?: BoolFilter<"Embedding"> | boolean
    hasImage?: BoolFilter<"Embedding"> | boolean
    wordCount?: IntNullableFilter<"Embedding"> | number | null
    createdAt?: DateTimeFilter<"Embedding"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    document?: XOR<DocumentNullableRelationFilter, DocumentWhereInput> | null
  }

  export type EmbeddingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    documentId?: SortOrderInput | SortOrder
    source?: SortOrder
    chunk?: SortOrder
    embedding?: SortOrder
    documentType?: SortOrderInput | SortOrder
    chunkIndex?: SortOrderInput | SortOrder
    totalChunks?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    startLine?: SortOrderInput | SortOrder
    endLine?: SortOrderInput | SortOrder
    chunkingConfig?: SortOrderInput | SortOrder
    sectionLevel?: SortOrderInput | SortOrder
    pageStart?: SortOrderInput | SortOrder
    pageEnd?: SortOrderInput | SortOrder
    hasTable?: SortOrder
    hasImage?: SortOrder
    wordCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    document?: DocumentOrderByWithRelationInput
  }

  export type EmbeddingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EmbeddingWhereInput | EmbeddingWhereInput[]
    OR?: EmbeddingWhereInput[]
    NOT?: EmbeddingWhereInput | EmbeddingWhereInput[]
    userId?: StringNullableFilter<"Embedding"> | string | null
    documentId?: StringNullableFilter<"Embedding"> | string | null
    source?: StringFilter<"Embedding"> | string
    chunk?: StringFilter<"Embedding"> | string
    embedding?: JsonFilter<"Embedding">
    documentType?: StringNullableFilter<"Embedding"> | string | null
    chunkIndex?: IntNullableFilter<"Embedding"> | number | null
    totalChunks?: IntNullableFilter<"Embedding"> | number | null
    section?: StringNullableFilter<"Embedding"> | string | null
    startLine?: IntNullableFilter<"Embedding"> | number | null
    endLine?: IntNullableFilter<"Embedding"> | number | null
    chunkingConfig?: JsonNullableFilter<"Embedding">
    sectionLevel?: IntNullableFilter<"Embedding"> | number | null
    pageStart?: IntNullableFilter<"Embedding"> | number | null
    pageEnd?: IntNullableFilter<"Embedding"> | number | null
    hasTable?: BoolFilter<"Embedding"> | boolean
    hasImage?: BoolFilter<"Embedding"> | boolean
    wordCount?: IntNullableFilter<"Embedding"> | number | null
    createdAt?: DateTimeFilter<"Embedding"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    document?: XOR<DocumentNullableRelationFilter, DocumentWhereInput> | null
  }, "id">

  export type EmbeddingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    documentId?: SortOrderInput | SortOrder
    source?: SortOrder
    chunk?: SortOrder
    embedding?: SortOrder
    documentType?: SortOrderInput | SortOrder
    chunkIndex?: SortOrderInput | SortOrder
    totalChunks?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    startLine?: SortOrderInput | SortOrder
    endLine?: SortOrderInput | SortOrder
    chunkingConfig?: SortOrderInput | SortOrder
    sectionLevel?: SortOrderInput | SortOrder
    pageStart?: SortOrderInput | SortOrder
    pageEnd?: SortOrderInput | SortOrder
    hasTable?: SortOrder
    hasImage?: SortOrder
    wordCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EmbeddingCountOrderByAggregateInput
    _avg?: EmbeddingAvgOrderByAggregateInput
    _max?: EmbeddingMaxOrderByAggregateInput
    _min?: EmbeddingMinOrderByAggregateInput
    _sum?: EmbeddingSumOrderByAggregateInput
  }

  export type EmbeddingScalarWhereWithAggregatesInput = {
    AND?: EmbeddingScalarWhereWithAggregatesInput | EmbeddingScalarWhereWithAggregatesInput[]
    OR?: EmbeddingScalarWhereWithAggregatesInput[]
    NOT?: EmbeddingScalarWhereWithAggregatesInput | EmbeddingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Embedding"> | string
    userId?: StringNullableWithAggregatesFilter<"Embedding"> | string | null
    documentId?: StringNullableWithAggregatesFilter<"Embedding"> | string | null
    source?: StringWithAggregatesFilter<"Embedding"> | string
    chunk?: StringWithAggregatesFilter<"Embedding"> | string
    embedding?: JsonWithAggregatesFilter<"Embedding">
    documentType?: StringNullableWithAggregatesFilter<"Embedding"> | string | null
    chunkIndex?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    totalChunks?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    section?: StringNullableWithAggregatesFilter<"Embedding"> | string | null
    startLine?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    endLine?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    chunkingConfig?: JsonNullableWithAggregatesFilter<"Embedding">
    sectionLevel?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    pageStart?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    pageEnd?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    hasTable?: BoolWithAggregatesFilter<"Embedding"> | boolean
    hasImage?: BoolWithAggregatesFilter<"Embedding"> | boolean
    wordCount?: IntNullableWithAggregatesFilter<"Embedding"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Embedding"> | Date | string
  }

  export type RetrievalLogWhereInput = {
    AND?: RetrievalLogWhereInput | RetrievalLogWhereInput[]
    OR?: RetrievalLogWhereInput[]
    NOT?: RetrievalLogWhereInput | RetrievalLogWhereInput[]
    id?: StringFilter<"RetrievalLog"> | string
    query?: StringFilter<"RetrievalLog"> | string
    results?: JsonFilter<"RetrievalLog">
    metrics?: JsonNullableFilter<"RetrievalLog">
    createdAt?: DateTimeFilter<"RetrievalLog"> | Date | string
  }

  export type RetrievalLogOrderByWithRelationInput = {
    id?: SortOrder
    query?: SortOrder
    results?: SortOrder
    metrics?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RetrievalLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RetrievalLogWhereInput | RetrievalLogWhereInput[]
    OR?: RetrievalLogWhereInput[]
    NOT?: RetrievalLogWhereInput | RetrievalLogWhereInput[]
    query?: StringFilter<"RetrievalLog"> | string
    results?: JsonFilter<"RetrievalLog">
    metrics?: JsonNullableFilter<"RetrievalLog">
    createdAt?: DateTimeFilter<"RetrievalLog"> | Date | string
  }, "id">

  export type RetrievalLogOrderByWithAggregationInput = {
    id?: SortOrder
    query?: SortOrder
    results?: SortOrder
    metrics?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RetrievalLogCountOrderByAggregateInput
    _max?: RetrievalLogMaxOrderByAggregateInput
    _min?: RetrievalLogMinOrderByAggregateInput
  }

  export type RetrievalLogScalarWhereWithAggregatesInput = {
    AND?: RetrievalLogScalarWhereWithAggregatesInput | RetrievalLogScalarWhereWithAggregatesInput[]
    OR?: RetrievalLogScalarWhereWithAggregatesInput[]
    NOT?: RetrievalLogScalarWhereWithAggregatesInput | RetrievalLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RetrievalLog"> | string
    query?: StringWithAggregatesFilter<"RetrievalLog"> | string
    results?: JsonWithAggregatesFilter<"RetrievalLog">
    metrics?: JsonNullableWithAggregatesFilter<"RetrievalLog">
    createdAt?: DateTimeWithAggregatesFilter<"RetrievalLog"> | Date | string
  }

  export type TopicWhereInput = {
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    id?: StringFilter<"Topic"> | string
    level?: IntFilter<"Topic"> | number
    name?: StringFilter<"Topic"> | string
    slug?: StringFilter<"Topic"> | string
    parentId?: StringNullableFilter<"Topic"> | string | null
    chapterNum?: IntNullableFilter<"Topic"> | number | null
    keywords?: StringNullableListFilter<"Topic">
    aliases?: StringNullableListFilter<"Topic">
    expectedQuestions?: IntFilter<"Topic"> | number
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    parent?: XOR<TopicNullableRelationFilter, TopicWhereInput> | null
    children?: TopicListRelationFilter
    interactions?: TopicInteractionListRelationFilter
    masteries?: TopicMasteryListRelationFilter
  }

  export type TopicOrderByWithRelationInput = {
    id?: SortOrder
    level?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    parentId?: SortOrderInput | SortOrder
    chapterNum?: SortOrderInput | SortOrder
    keywords?: SortOrder
    aliases?: SortOrder
    expectedQuestions?: SortOrder
    createdAt?: SortOrder
    parent?: TopicOrderByWithRelationInput
    children?: TopicOrderByRelationAggregateInput
    interactions?: TopicInteractionOrderByRelationAggregateInput
    masteries?: TopicMasteryOrderByRelationAggregateInput
  }

  export type TopicWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    level?: IntFilter<"Topic"> | number
    name?: StringFilter<"Topic"> | string
    parentId?: StringNullableFilter<"Topic"> | string | null
    chapterNum?: IntNullableFilter<"Topic"> | number | null
    keywords?: StringNullableListFilter<"Topic">
    aliases?: StringNullableListFilter<"Topic">
    expectedQuestions?: IntFilter<"Topic"> | number
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    parent?: XOR<TopicNullableRelationFilter, TopicWhereInput> | null
    children?: TopicListRelationFilter
    interactions?: TopicInteractionListRelationFilter
    masteries?: TopicMasteryListRelationFilter
  }, "id" | "slug">

  export type TopicOrderByWithAggregationInput = {
    id?: SortOrder
    level?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    parentId?: SortOrderInput | SortOrder
    chapterNum?: SortOrderInput | SortOrder
    keywords?: SortOrder
    aliases?: SortOrder
    expectedQuestions?: SortOrder
    createdAt?: SortOrder
    _count?: TopicCountOrderByAggregateInput
    _avg?: TopicAvgOrderByAggregateInput
    _max?: TopicMaxOrderByAggregateInput
    _min?: TopicMinOrderByAggregateInput
    _sum?: TopicSumOrderByAggregateInput
  }

  export type TopicScalarWhereWithAggregatesInput = {
    AND?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    OR?: TopicScalarWhereWithAggregatesInput[]
    NOT?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Topic"> | string
    level?: IntWithAggregatesFilter<"Topic"> | number
    name?: StringWithAggregatesFilter<"Topic"> | string
    slug?: StringWithAggregatesFilter<"Topic"> | string
    parentId?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    chapterNum?: IntNullableWithAggregatesFilter<"Topic"> | number | null
    keywords?: StringNullableListFilter<"Topic">
    aliases?: StringNullableListFilter<"Topic">
    expectedQuestions?: IntWithAggregatesFilter<"Topic"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Topic"> | Date | string
  }

  export type TopicInteractionWhereInput = {
    AND?: TopicInteractionWhereInput | TopicInteractionWhereInput[]
    OR?: TopicInteractionWhereInput[]
    NOT?: TopicInteractionWhereInput | TopicInteractionWhereInput[]
    id?: StringFilter<"TopicInteraction"> | string
    userId?: StringFilter<"TopicInteraction"> | string
    topicId?: StringFilter<"TopicInteraction"> | string
    query?: StringFilter<"TopicInteraction"> | string
    mappingConfidence?: FloatFilter<"TopicInteraction"> | number
    ragConfidence?: StringFilter<"TopicInteraction"> | string
    ragTopScore?: FloatFilter<"TopicInteraction"> | number
    citedSections?: StringNullableListFilter<"TopicInteraction">
    answerLength?: IntFilter<"TopicInteraction"> | number
    citationCount?: IntFilter<"TopicInteraction"> | number
    timeSpentMs?: IntNullableFilter<"TopicInteraction"> | number | null
    hadFollowUp?: BoolFilter<"TopicInteraction"> | boolean
    createdAt?: DateTimeFilter<"TopicInteraction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    topic?: XOR<TopicRelationFilter, TopicWhereInput>
  }

  export type TopicInteractionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    query?: SortOrder
    mappingConfidence?: SortOrder
    ragConfidence?: SortOrder
    ragTopScore?: SortOrder
    citedSections?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrderInput | SortOrder
    hadFollowUp?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    topic?: TopicOrderByWithRelationInput
  }

  export type TopicInteractionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TopicInteractionWhereInput | TopicInteractionWhereInput[]
    OR?: TopicInteractionWhereInput[]
    NOT?: TopicInteractionWhereInput | TopicInteractionWhereInput[]
    userId?: StringFilter<"TopicInteraction"> | string
    topicId?: StringFilter<"TopicInteraction"> | string
    query?: StringFilter<"TopicInteraction"> | string
    mappingConfidence?: FloatFilter<"TopicInteraction"> | number
    ragConfidence?: StringFilter<"TopicInteraction"> | string
    ragTopScore?: FloatFilter<"TopicInteraction"> | number
    citedSections?: StringNullableListFilter<"TopicInteraction">
    answerLength?: IntFilter<"TopicInteraction"> | number
    citationCount?: IntFilter<"TopicInteraction"> | number
    timeSpentMs?: IntNullableFilter<"TopicInteraction"> | number | null
    hadFollowUp?: BoolFilter<"TopicInteraction"> | boolean
    createdAt?: DateTimeFilter<"TopicInteraction"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    topic?: XOR<TopicRelationFilter, TopicWhereInput>
  }, "id">

  export type TopicInteractionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    query?: SortOrder
    mappingConfidence?: SortOrder
    ragConfidence?: SortOrder
    ragTopScore?: SortOrder
    citedSections?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrderInput | SortOrder
    hadFollowUp?: SortOrder
    createdAt?: SortOrder
    _count?: TopicInteractionCountOrderByAggregateInput
    _avg?: TopicInteractionAvgOrderByAggregateInput
    _max?: TopicInteractionMaxOrderByAggregateInput
    _min?: TopicInteractionMinOrderByAggregateInput
    _sum?: TopicInteractionSumOrderByAggregateInput
  }

  export type TopicInteractionScalarWhereWithAggregatesInput = {
    AND?: TopicInteractionScalarWhereWithAggregatesInput | TopicInteractionScalarWhereWithAggregatesInput[]
    OR?: TopicInteractionScalarWhereWithAggregatesInput[]
    NOT?: TopicInteractionScalarWhereWithAggregatesInput | TopicInteractionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TopicInteraction"> | string
    userId?: StringWithAggregatesFilter<"TopicInteraction"> | string
    topicId?: StringWithAggregatesFilter<"TopicInteraction"> | string
    query?: StringWithAggregatesFilter<"TopicInteraction"> | string
    mappingConfidence?: FloatWithAggregatesFilter<"TopicInteraction"> | number
    ragConfidence?: StringWithAggregatesFilter<"TopicInteraction"> | string
    ragTopScore?: FloatWithAggregatesFilter<"TopicInteraction"> | number
    citedSections?: StringNullableListFilter<"TopicInteraction">
    answerLength?: IntWithAggregatesFilter<"TopicInteraction"> | number
    citationCount?: IntWithAggregatesFilter<"TopicInteraction"> | number
    timeSpentMs?: IntNullableWithAggregatesFilter<"TopicInteraction"> | number | null
    hadFollowUp?: BoolWithAggregatesFilter<"TopicInteraction"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TopicInteraction"> | Date | string
  }

  export type TopicMasteryWhereInput = {
    AND?: TopicMasteryWhereInput | TopicMasteryWhereInput[]
    OR?: TopicMasteryWhereInput[]
    NOT?: TopicMasteryWhereInput | TopicMasteryWhereInput[]
    id?: StringFilter<"TopicMastery"> | string
    userId?: StringFilter<"TopicMastery"> | string
    topicId?: StringFilter<"TopicMastery"> | string
    masteryLevel?: FloatFilter<"TopicMastery"> | number
    status?: EnumMasteryStatusFilter<"TopicMastery"> | $Enums.MasteryStatus
    questionsAsked?: IntFilter<"TopicMastery"> | number
    coverageScore?: FloatFilter<"TopicMastery"> | number
    depthScore?: FloatFilter<"TopicMastery"> | number
    confidenceScore?: FloatFilter<"TopicMastery"> | number
    diversityScore?: FloatFilter<"TopicMastery"> | number
    retentionScore?: FloatFilter<"TopicMastery"> | number
    subtopicsExplored?: StringNullableListFilter<"TopicMastery">
    firstInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    lastInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    updatedAt?: DateTimeFilter<"TopicMastery"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    topic?: XOR<TopicRelationFilter, TopicWhereInput>
  }

  export type TopicMasteryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    masteryLevel?: SortOrder
    status?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
    subtopicsExplored?: SortOrder
    firstInteraction?: SortOrderInput | SortOrder
    lastInteraction?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    topic?: TopicOrderByWithRelationInput
  }

  export type TopicMasteryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_topicId?: TopicMasteryUserIdTopicIdCompoundUniqueInput
    AND?: TopicMasteryWhereInput | TopicMasteryWhereInput[]
    OR?: TopicMasteryWhereInput[]
    NOT?: TopicMasteryWhereInput | TopicMasteryWhereInput[]
    userId?: StringFilter<"TopicMastery"> | string
    topicId?: StringFilter<"TopicMastery"> | string
    masteryLevel?: FloatFilter<"TopicMastery"> | number
    status?: EnumMasteryStatusFilter<"TopicMastery"> | $Enums.MasteryStatus
    questionsAsked?: IntFilter<"TopicMastery"> | number
    coverageScore?: FloatFilter<"TopicMastery"> | number
    depthScore?: FloatFilter<"TopicMastery"> | number
    confidenceScore?: FloatFilter<"TopicMastery"> | number
    diversityScore?: FloatFilter<"TopicMastery"> | number
    retentionScore?: FloatFilter<"TopicMastery"> | number
    subtopicsExplored?: StringNullableListFilter<"TopicMastery">
    firstInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    lastInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    updatedAt?: DateTimeFilter<"TopicMastery"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    topic?: XOR<TopicRelationFilter, TopicWhereInput>
  }, "id" | "userId_topicId">

  export type TopicMasteryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    masteryLevel?: SortOrder
    status?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
    subtopicsExplored?: SortOrder
    firstInteraction?: SortOrderInput | SortOrder
    lastInteraction?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: TopicMasteryCountOrderByAggregateInput
    _avg?: TopicMasteryAvgOrderByAggregateInput
    _max?: TopicMasteryMaxOrderByAggregateInput
    _min?: TopicMasteryMinOrderByAggregateInput
    _sum?: TopicMasterySumOrderByAggregateInput
  }

  export type TopicMasteryScalarWhereWithAggregatesInput = {
    AND?: TopicMasteryScalarWhereWithAggregatesInput | TopicMasteryScalarWhereWithAggregatesInput[]
    OR?: TopicMasteryScalarWhereWithAggregatesInput[]
    NOT?: TopicMasteryScalarWhereWithAggregatesInput | TopicMasteryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TopicMastery"> | string
    userId?: StringWithAggregatesFilter<"TopicMastery"> | string
    topicId?: StringWithAggregatesFilter<"TopicMastery"> | string
    masteryLevel?: FloatWithAggregatesFilter<"TopicMastery"> | number
    status?: EnumMasteryStatusWithAggregatesFilter<"TopicMastery"> | $Enums.MasteryStatus
    questionsAsked?: IntWithAggregatesFilter<"TopicMastery"> | number
    coverageScore?: FloatWithAggregatesFilter<"TopicMastery"> | number
    depthScore?: FloatWithAggregatesFilter<"TopicMastery"> | number
    confidenceScore?: FloatWithAggregatesFilter<"TopicMastery"> | number
    diversityScore?: FloatWithAggregatesFilter<"TopicMastery"> | number
    retentionScore?: FloatWithAggregatesFilter<"TopicMastery"> | number
    subtopicsExplored?: StringNullableListFilter<"TopicMastery">
    firstInteraction?: DateTimeNullableWithAggregatesFilter<"TopicMastery"> | Date | string | null
    lastInteraction?: DateTimeNullableWithAggregatesFilter<"TopicMastery"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"TopicMastery"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"TopicMastery"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteCreateInput = {
    id?: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotesInput
  }

  export type NoteUncheckedCreateInput = {
    id?: string
    userId: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
  }

  export type NoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotesNestedInput
  }

  export type NoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteCreateManyInput = {
    id?: string
    userId: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
  }

  export type NoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressCreateInput = {
    id?: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
    user: UserCreateNestedOneWithoutProgressInput
  }

  export type ProgressUncheckedCreateInput = {
    id?: string
    userId: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
  }

  export type ProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProgressNestedInput
  }

  export type ProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressCreateManyInput = {
    id?: string
    userId: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
  }

  export type ProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDocumentsInput
    embeddings?: EmbeddingCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    userId: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDocumentsNestedInput
    embeddings?: EmbeddingUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    embeddings?: EmbeddingUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    userId: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingCreateInput = {
    id?: string
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutEmbeddingsInput
    document?: DocumentCreateNestedOneWithoutEmbeddingsInput
  }

  export type EmbeddingUncheckedCreateInput = {
    id?: string
    userId?: string | null
    documentId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type EmbeddingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEmbeddingsNestedInput
    document?: DocumentUpdateOneWithoutEmbeddingsNestedInput
  }

  export type EmbeddingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingCreateManyInput = {
    id?: string
    userId?: string | null
    documentId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type EmbeddingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetrievalLogCreateInput = {
    id?: string
    query: string
    results: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RetrievalLogUncheckedCreateInput = {
    id?: string
    query: string
    results: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RetrievalLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetrievalLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetrievalLogCreateManyInput = {
    id?: string
    query: string
    results: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type RetrievalLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RetrievalLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    results?: JsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    parent?: TopicCreateNestedOneWithoutChildrenInput
    children?: TopicCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateInput = {
    id: string
    level: number
    name: string
    slug: string
    parentId?: string | null
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    children?: TopicUncheckedCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionUncheckedCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: TopicUpdateOneWithoutChildrenNestedInput
    children?: TopicUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: TopicUncheckedUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUncheckedUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicCreateManyInput = {
    id: string
    level: number
    name: string
    slug: string
    parentId?: string | null
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
  }

  export type TopicUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicInteractionsNestedInput
    topic?: TopicUpdateOneRequiredWithoutInteractionsNestedInput
  }

  export type TopicInteractionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryCreateInput = {
    id?: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTopicMasteriesInput
    topic: TopicCreateNestedOneWithoutMasteriesInput
  }

  export type TopicMasteryUncheckedCreateInput = {
    id?: string
    userId: string
    topicId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type TopicMasteryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicMasteriesNestedInput
    topic?: TopicUpdateOneRequiredWithoutMasteriesNestedInput
  }

  export type TopicMasteryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryCreateManyInput = {
    id?: string
    userId: string
    topicId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type TopicMasteryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NoteListRelationFilter = {
    every?: NoteWhereInput
    some?: NoteWhereInput
    none?: NoteWhereInput
  }

  export type ProgressListRelationFilter = {
    every?: ProgressWhereInput
    some?: ProgressWhereInput
    none?: ProgressWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type EmbeddingListRelationFilter = {
    every?: EmbeddingWhereInput
    some?: EmbeddingWhereInput
    none?: EmbeddingWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type TopicInteractionListRelationFilter = {
    every?: TopicInteractionWhereInput
    some?: TopicInteractionWhereInput
    none?: TopicInteractionWhereInput
  }

  export type TopicMasteryListRelationFilter = {
    every?: TopicMasteryWhereInput
    some?: TopicMasteryWhereInput
    none?: TopicMasteryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type NoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmbeddingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicInteractionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicMasteryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    failedLogins?: SortOrder
    lockedUntil?: SortOrder
    verificationToken?: SortOrder
    verificationExpires?: SortOrder
    resetToken?: SortOrder
    resetTokenExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedLogins?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    failedLogins?: SortOrder
    lockedUntil?: SortOrder
    verificationToken?: SortOrder
    verificationExpires?: SortOrder
    resetToken?: SortOrder
    resetTokenExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isVerified?: SortOrder
    failedLogins?: SortOrder
    lockedUntil?: SortOrder
    verificationToken?: SortOrder
    verificationExpires?: SortOrder
    resetToken?: SortOrder
    resetTokenExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedLogins?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NoteCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    page?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type NoteAvgOrderByAggregateInput = {
    page?: SortOrder
  }

  export type NoteMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    page?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type NoteMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    page?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type NoteSumOrderByAggregateInput = {
    page?: SortOrder
  }

  export type ProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    pagesRead?: SortOrder
    minutes?: SortOrder
    date?: SortOrder
  }

  export type ProgressAvgOrderByAggregateInput = {
    pagesRead?: SortOrder
    minutes?: SortOrder
  }

  export type ProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    pagesRead?: SortOrder
    minutes?: SortOrder
    date?: SortOrder
  }

  export type ProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    document?: SortOrder
    pagesRead?: SortOrder
    minutes?: SortOrder
    date?: SortOrder
  }

  export type ProgressSumOrderByAggregateInput = {
    pagesRead?: SortOrder
    minutes?: SortOrder
  }

  export type EnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    contentHash?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    status?: SortOrder
    isSystemDocument?: SortOrder
    totalChunks?: SortOrder
    processedChunks?: SortOrder
    processingError?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    totalChunks?: SortOrder
    processedChunks?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    contentHash?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    status?: SortOrder
    isSystemDocument?: SortOrder
    totalChunks?: SortOrder
    processedChunks?: SortOrder
    processingError?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    filename?: SortOrder
    originalName?: SortOrder
    contentHash?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    status?: SortOrder
    isSystemDocument?: SortOrder
    totalChunks?: SortOrder
    processedChunks?: SortOrder
    processingError?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    fileSize?: SortOrder
    totalChunks?: SortOrder
    processedChunks?: SortOrder
  }

  export type EnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DocumentNullableRelationFilter = {
    is?: DocumentWhereInput | null
    isNot?: DocumentWhereInput | null
  }

  export type EmbeddingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    source?: SortOrder
    chunk?: SortOrder
    embedding?: SortOrder
    documentType?: SortOrder
    chunkIndex?: SortOrder
    totalChunks?: SortOrder
    section?: SortOrder
    startLine?: SortOrder
    endLine?: SortOrder
    chunkingConfig?: SortOrder
    sectionLevel?: SortOrder
    pageStart?: SortOrder
    pageEnd?: SortOrder
    hasTable?: SortOrder
    hasImage?: SortOrder
    wordCount?: SortOrder
    createdAt?: SortOrder
  }

  export type EmbeddingAvgOrderByAggregateInput = {
    chunkIndex?: SortOrder
    totalChunks?: SortOrder
    startLine?: SortOrder
    endLine?: SortOrder
    sectionLevel?: SortOrder
    pageStart?: SortOrder
    pageEnd?: SortOrder
    wordCount?: SortOrder
  }

  export type EmbeddingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    source?: SortOrder
    chunk?: SortOrder
    documentType?: SortOrder
    chunkIndex?: SortOrder
    totalChunks?: SortOrder
    section?: SortOrder
    startLine?: SortOrder
    endLine?: SortOrder
    sectionLevel?: SortOrder
    pageStart?: SortOrder
    pageEnd?: SortOrder
    hasTable?: SortOrder
    hasImage?: SortOrder
    wordCount?: SortOrder
    createdAt?: SortOrder
  }

  export type EmbeddingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    source?: SortOrder
    chunk?: SortOrder
    documentType?: SortOrder
    chunkIndex?: SortOrder
    totalChunks?: SortOrder
    section?: SortOrder
    startLine?: SortOrder
    endLine?: SortOrder
    sectionLevel?: SortOrder
    pageStart?: SortOrder
    pageEnd?: SortOrder
    hasTable?: SortOrder
    hasImage?: SortOrder
    wordCount?: SortOrder
    createdAt?: SortOrder
  }

  export type EmbeddingSumOrderByAggregateInput = {
    chunkIndex?: SortOrder
    totalChunks?: SortOrder
    startLine?: SortOrder
    endLine?: SortOrder
    sectionLevel?: SortOrder
    pageStart?: SortOrder
    pageEnd?: SortOrder
    wordCount?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type RetrievalLogCountOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    results?: SortOrder
    metrics?: SortOrder
    createdAt?: SortOrder
  }

  export type RetrievalLogMaxOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    createdAt?: SortOrder
  }

  export type RetrievalLogMinOrderByAggregateInput = {
    id?: SortOrder
    query?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type TopicNullableRelationFilter = {
    is?: TopicWhereInput | null
    isNot?: TopicWhereInput | null
  }

  export type TopicListRelationFilter = {
    every?: TopicWhereInput
    some?: TopicWhereInput
    none?: TopicWhereInput
  }

  export type TopicOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicCountOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    parentId?: SortOrder
    chapterNum?: SortOrder
    keywords?: SortOrder
    aliases?: SortOrder
    expectedQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicAvgOrderByAggregateInput = {
    level?: SortOrder
    chapterNum?: SortOrder
    expectedQuestions?: SortOrder
  }

  export type TopicMaxOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    parentId?: SortOrder
    chapterNum?: SortOrder
    expectedQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicMinOrderByAggregateInput = {
    id?: SortOrder
    level?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    parentId?: SortOrder
    chapterNum?: SortOrder
    expectedQuestions?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicSumOrderByAggregateInput = {
    level?: SortOrder
    chapterNum?: SortOrder
    expectedQuestions?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TopicRelationFilter = {
    is?: TopicWhereInput
    isNot?: TopicWhereInput
  }

  export type TopicInteractionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    query?: SortOrder
    mappingConfidence?: SortOrder
    ragConfidence?: SortOrder
    ragTopScore?: SortOrder
    citedSections?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrder
    hadFollowUp?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicInteractionAvgOrderByAggregateInput = {
    mappingConfidence?: SortOrder
    ragTopScore?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrder
  }

  export type TopicInteractionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    query?: SortOrder
    mappingConfidence?: SortOrder
    ragConfidence?: SortOrder
    ragTopScore?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrder
    hadFollowUp?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicInteractionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    query?: SortOrder
    mappingConfidence?: SortOrder
    ragConfidence?: SortOrder
    ragTopScore?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrder
    hadFollowUp?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicInteractionSumOrderByAggregateInput = {
    mappingConfidence?: SortOrder
    ragTopScore?: SortOrder
    answerLength?: SortOrder
    citationCount?: SortOrder
    timeSpentMs?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumMasteryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MasteryStatus | EnumMasteryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMasteryStatusFilter<$PrismaModel> | $Enums.MasteryStatus
  }

  export type TopicMasteryUserIdTopicIdCompoundUniqueInput = {
    userId: string
    topicId: string
  }

  export type TopicMasteryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    masteryLevel?: SortOrder
    status?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
    subtopicsExplored?: SortOrder
    firstInteraction?: SortOrder
    lastInteraction?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicMasteryAvgOrderByAggregateInput = {
    masteryLevel?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
  }

  export type TopicMasteryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    masteryLevel?: SortOrder
    status?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
    firstInteraction?: SortOrder
    lastInteraction?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicMasteryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    masteryLevel?: SortOrder
    status?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
    firstInteraction?: SortOrder
    lastInteraction?: SortOrder
    completedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicMasterySumOrderByAggregateInput = {
    masteryLevel?: SortOrder
    questionsAsked?: SortOrder
    coverageScore?: SortOrder
    depthScore?: SortOrder
    confidenceScore?: SortOrder
    diversityScore?: SortOrder
    retentionScore?: SortOrder
  }

  export type EnumMasteryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MasteryStatus | EnumMasteryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMasteryStatusWithAggregatesFilter<$PrismaModel> | $Enums.MasteryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMasteryStatusFilter<$PrismaModel>
    _max?: NestedEnumMasteryStatusFilter<$PrismaModel>
  }

  export type NoteCreateNestedManyWithoutUserInput = {
    create?: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput> | NoteCreateWithoutUserInput[] | NoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutUserInput | NoteCreateOrConnectWithoutUserInput[]
    createMany?: NoteCreateManyUserInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type ProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput> | ProgressCreateWithoutUserInput[] | ProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput | ProgressCreateOrConnectWithoutUserInput[]
    createMany?: ProgressCreateManyUserInputEnvelope
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutUserInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type EmbeddingCreateNestedManyWithoutUserInput = {
    create?: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput> | EmbeddingCreateWithoutUserInput[] | EmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutUserInput | EmbeddingCreateOrConnectWithoutUserInput[]
    createMany?: EmbeddingCreateManyUserInputEnvelope
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type TopicInteractionCreateNestedManyWithoutUserInput = {
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
  }

  export type TopicMasteryCreateNestedManyWithoutUserInput = {
    create?: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput> | TopicMasteryCreateWithoutUserInput[] | TopicMasteryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutUserInput | TopicMasteryCreateOrConnectWithoutUserInput[]
    createMany?: TopicMasteryCreateManyUserInputEnvelope
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
  }

  export type NoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput> | NoteCreateWithoutUserInput[] | NoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutUserInput | NoteCreateOrConnectWithoutUserInput[]
    createMany?: NoteCreateManyUserInputEnvelope
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
  }

  export type ProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput> | ProgressCreateWithoutUserInput[] | ProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput | ProgressCreateOrConnectWithoutUserInput[]
    createMany?: ProgressCreateManyUserInputEnvelope
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type EmbeddingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput> | EmbeddingCreateWithoutUserInput[] | EmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutUserInput | EmbeddingCreateOrConnectWithoutUserInput[]
    createMany?: EmbeddingCreateManyUserInputEnvelope
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type TopicInteractionUncheckedCreateNestedManyWithoutUserInput = {
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
  }

  export type TopicMasteryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput> | TopicMasteryCreateWithoutUserInput[] | TopicMasteryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutUserInput | TopicMasteryCreateOrConnectWithoutUserInput[]
    createMany?: TopicMasteryCreateManyUserInputEnvelope
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput> | NoteCreateWithoutUserInput[] | NoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutUserInput | NoteCreateOrConnectWithoutUserInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutUserInput | NoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NoteCreateManyUserInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutUserInput | NoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutUserInput | NoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type ProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput> | ProgressCreateWithoutUserInput[] | ProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput | ProgressCreateOrConnectWithoutUserInput[]
    upsert?: ProgressUpsertWithWhereUniqueWithoutUserInput | ProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgressCreateManyUserInputEnvelope
    set?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    disconnect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    delete?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    update?: ProgressUpdateWithWhereUniqueWithoutUserInput | ProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgressUpdateManyWithWhereWithoutUserInput | ProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutUserNestedInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUserInput | DocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUserInput | DocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUserInput | DocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type EmbeddingUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput> | EmbeddingCreateWithoutUserInput[] | EmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutUserInput | EmbeddingCreateOrConnectWithoutUserInput[]
    upsert?: EmbeddingUpsertWithWhereUniqueWithoutUserInput | EmbeddingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmbeddingCreateManyUserInputEnvelope
    set?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    disconnect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    delete?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    update?: EmbeddingUpdateWithWhereUniqueWithoutUserInput | EmbeddingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmbeddingUpdateManyWithWhereWithoutUserInput | EmbeddingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type TopicInteractionUpdateManyWithoutUserNestedInput = {
    set?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    disconnect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    delete?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    update?: TopicInteractionUpdateWithWhereUniqueWithoutUserInput | TopicInteractionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicInteractionUpdateManyWithWhereWithoutUserInput | TopicInteractionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
  }

  export type TopicMasteryUpdateManyWithoutUserNestedInput = {
    create?: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput> | TopicMasteryCreateWithoutUserInput[] | TopicMasteryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutUserInput | TopicMasteryCreateOrConnectWithoutUserInput[]
    upsert?: TopicMasteryUpsertWithWhereUniqueWithoutUserInput | TopicMasteryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TopicMasteryCreateManyUserInputEnvelope
    set?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    disconnect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    delete?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    update?: TopicMasteryUpdateWithWhereUniqueWithoutUserInput | TopicMasteryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicMasteryUpdateManyWithWhereWithoutUserInput | TopicMasteryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
  }

  export type NoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput> | NoteCreateWithoutUserInput[] | NoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NoteCreateOrConnectWithoutUserInput | NoteCreateOrConnectWithoutUserInput[]
    upsert?: NoteUpsertWithWhereUniqueWithoutUserInput | NoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NoteCreateManyUserInputEnvelope
    set?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    disconnect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    delete?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    connect?: NoteWhereUniqueInput | NoteWhereUniqueInput[]
    update?: NoteUpdateWithWhereUniqueWithoutUserInput | NoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NoteUpdateManyWithWhereWithoutUserInput | NoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NoteScalarWhereInput | NoteScalarWhereInput[]
  }

  export type ProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput> | ProgressCreateWithoutUserInput[] | ProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgressCreateOrConnectWithoutUserInput | ProgressCreateOrConnectWithoutUserInput[]
    upsert?: ProgressUpsertWithWhereUniqueWithoutUserInput | ProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgressCreateManyUserInputEnvelope
    set?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    disconnect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    delete?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    connect?: ProgressWhereUniqueInput | ProgressWhereUniqueInput[]
    update?: ProgressUpdateWithWhereUniqueWithoutUserInput | ProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgressUpdateManyWithWhereWithoutUserInput | ProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput> | DocumentCreateWithoutUserInput[] | DocumentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutUserInput | DocumentCreateOrConnectWithoutUserInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutUserInput | DocumentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DocumentCreateManyUserInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutUserInput | DocumentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutUserInput | DocumentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type EmbeddingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput> | EmbeddingCreateWithoutUserInput[] | EmbeddingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutUserInput | EmbeddingCreateOrConnectWithoutUserInput[]
    upsert?: EmbeddingUpsertWithWhereUniqueWithoutUserInput | EmbeddingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmbeddingCreateManyUserInputEnvelope
    set?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    disconnect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    delete?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    update?: EmbeddingUpdateWithWhereUniqueWithoutUserInput | EmbeddingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmbeddingUpdateManyWithWhereWithoutUserInput | EmbeddingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type TopicInteractionUncheckedUpdateManyWithoutUserNestedInput = {
    set?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    disconnect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    delete?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    update?: TopicInteractionUpdateWithWhereUniqueWithoutUserInput | TopicInteractionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicInteractionUpdateManyWithWhereWithoutUserInput | TopicInteractionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
  }

  export type TopicMasteryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput> | TopicMasteryCreateWithoutUserInput[] | TopicMasteryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutUserInput | TopicMasteryCreateOrConnectWithoutUserInput[]
    upsert?: TopicMasteryUpsertWithWhereUniqueWithoutUserInput | TopicMasteryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TopicMasteryCreateManyUserInputEnvelope
    set?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    disconnect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    delete?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    update?: TopicMasteryUpdateWithWhereUniqueWithoutUserInput | TopicMasteryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TopicMasteryUpdateManyWithWhereWithoutUserInput | TopicMasteryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserCreateNestedOneWithoutNotesInput = {
    create?: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotesNestedInput = {
    create?: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotesInput
    upsert?: UserUpsertWithoutNotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotesInput, UserUpdateWithoutNotesInput>, UserUncheckedUpdateWithoutNotesInput>
  }

  export type UserCreateNestedOneWithoutProgressInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    upsert?: UserUpsertWithoutProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgressInput, UserUpdateWithoutProgressInput>, UserUncheckedUpdateWithoutProgressInput>
  }

  export type UserCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type EmbeddingCreateNestedManyWithoutDocumentInput = {
    create?: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput> | EmbeddingCreateWithoutDocumentInput[] | EmbeddingUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutDocumentInput | EmbeddingCreateOrConnectWithoutDocumentInput[]
    createMany?: EmbeddingCreateManyDocumentInputEnvelope
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
  }

  export type EmbeddingUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput> | EmbeddingCreateWithoutDocumentInput[] | EmbeddingUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutDocumentInput | EmbeddingCreateOrConnectWithoutDocumentInput[]
    createMany?: EmbeddingCreateManyDocumentInputEnvelope
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
  }

  export type EnumDocumentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DocumentStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    upsert?: UserUpsertWithoutDocumentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDocumentsInput, UserUpdateWithoutDocumentsInput>, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type EmbeddingUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput> | EmbeddingCreateWithoutDocumentInput[] | EmbeddingUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutDocumentInput | EmbeddingCreateOrConnectWithoutDocumentInput[]
    upsert?: EmbeddingUpsertWithWhereUniqueWithoutDocumentInput | EmbeddingUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: EmbeddingCreateManyDocumentInputEnvelope
    set?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    disconnect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    delete?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    update?: EmbeddingUpdateWithWhereUniqueWithoutDocumentInput | EmbeddingUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: EmbeddingUpdateManyWithWhereWithoutDocumentInput | EmbeddingUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
  }

  export type EmbeddingUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput> | EmbeddingCreateWithoutDocumentInput[] | EmbeddingUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: EmbeddingCreateOrConnectWithoutDocumentInput | EmbeddingCreateOrConnectWithoutDocumentInput[]
    upsert?: EmbeddingUpsertWithWhereUniqueWithoutDocumentInput | EmbeddingUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: EmbeddingCreateManyDocumentInputEnvelope
    set?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    disconnect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    delete?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    connect?: EmbeddingWhereUniqueInput | EmbeddingWhereUniqueInput[]
    update?: EmbeddingUpdateWithWhereUniqueWithoutDocumentInput | EmbeddingUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: EmbeddingUpdateManyWithWhereWithoutDocumentInput | EmbeddingUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutEmbeddingsInput = {
    create?: XOR<UserCreateWithoutEmbeddingsInput, UserUncheckedCreateWithoutEmbeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmbeddingsInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutEmbeddingsInput = {
    create?: XOR<DocumentCreateWithoutEmbeddingsInput, DocumentUncheckedCreateWithoutEmbeddingsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutEmbeddingsInput
    connect?: DocumentWhereUniqueInput
  }

  export type UserUpdateOneWithoutEmbeddingsNestedInput = {
    create?: XOR<UserCreateWithoutEmbeddingsInput, UserUncheckedCreateWithoutEmbeddingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmbeddingsInput
    upsert?: UserUpsertWithoutEmbeddingsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEmbeddingsInput, UserUpdateWithoutEmbeddingsInput>, UserUncheckedUpdateWithoutEmbeddingsInput>
  }

  export type DocumentUpdateOneWithoutEmbeddingsNestedInput = {
    create?: XOR<DocumentCreateWithoutEmbeddingsInput, DocumentUncheckedCreateWithoutEmbeddingsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutEmbeddingsInput
    upsert?: DocumentUpsertWithoutEmbeddingsInput
    disconnect?: DocumentWhereInput | boolean
    delete?: DocumentWhereInput | boolean
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutEmbeddingsInput, DocumentUpdateWithoutEmbeddingsInput>, DocumentUncheckedUpdateWithoutEmbeddingsInput>
  }

  export type TopicCreatekeywordsInput = {
    set: string[]
  }

  export type TopicCreatealiasesInput = {
    set: string[]
  }

  export type TopicCreateNestedOneWithoutChildrenInput = {
    create?: XOR<TopicCreateWithoutChildrenInput, TopicUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: TopicCreateOrConnectWithoutChildrenInput
    connect?: TopicWhereUniqueInput
  }

  export type TopicCreateNestedManyWithoutParentInput = {
    create?: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput> | TopicCreateWithoutParentInput[] | TopicUncheckedCreateWithoutParentInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutParentInput | TopicCreateOrConnectWithoutParentInput[]
    createMany?: TopicCreateManyParentInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type TopicInteractionCreateNestedManyWithoutTopicInput = {
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
  }

  export type TopicMasteryCreateNestedManyWithoutTopicInput = {
    create?: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput> | TopicMasteryCreateWithoutTopicInput[] | TopicMasteryUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutTopicInput | TopicMasteryCreateOrConnectWithoutTopicInput[]
    createMany?: TopicMasteryCreateManyTopicInputEnvelope
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
  }

  export type TopicUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput> | TopicCreateWithoutParentInput[] | TopicUncheckedCreateWithoutParentInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutParentInput | TopicCreateOrConnectWithoutParentInput[]
    createMany?: TopicCreateManyParentInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type TopicInteractionUncheckedCreateNestedManyWithoutTopicInput = {
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
  }

  export type TopicMasteryUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput> | TopicMasteryCreateWithoutTopicInput[] | TopicMasteryUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutTopicInput | TopicMasteryCreateOrConnectWithoutTopicInput[]
    createMany?: TopicMasteryCreateManyTopicInputEnvelope
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
  }

  export type TopicUpdatekeywordsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TopicUpdatealiasesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TopicUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<TopicCreateWithoutChildrenInput, TopicUncheckedCreateWithoutChildrenInput>
    connectOrCreate?: TopicCreateOrConnectWithoutChildrenInput
    upsert?: TopicUpsertWithoutChildrenInput
    disconnect?: TopicWhereInput | boolean
    delete?: TopicWhereInput | boolean
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutChildrenInput, TopicUpdateWithoutChildrenInput>, TopicUncheckedUpdateWithoutChildrenInput>
  }

  export type TopicUpdateManyWithoutParentNestedInput = {
    create?: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput> | TopicCreateWithoutParentInput[] | TopicUncheckedCreateWithoutParentInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutParentInput | TopicCreateOrConnectWithoutParentInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutParentInput | TopicUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: TopicCreateManyParentInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutParentInput | TopicUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutParentInput | TopicUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type TopicInteractionUpdateManyWithoutTopicNestedInput = {
    set?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    disconnect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    delete?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    update?: TopicInteractionUpdateWithWhereUniqueWithoutTopicInput | TopicInteractionUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicInteractionUpdateManyWithWhereWithoutTopicInput | TopicInteractionUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
  }

  export type TopicMasteryUpdateManyWithoutTopicNestedInput = {
    create?: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput> | TopicMasteryCreateWithoutTopicInput[] | TopicMasteryUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutTopicInput | TopicMasteryCreateOrConnectWithoutTopicInput[]
    upsert?: TopicMasteryUpsertWithWhereUniqueWithoutTopicInput | TopicMasteryUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: TopicMasteryCreateManyTopicInputEnvelope
    set?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    disconnect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    delete?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    update?: TopicMasteryUpdateWithWhereUniqueWithoutTopicInput | TopicMasteryUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicMasteryUpdateManyWithWhereWithoutTopicInput | TopicMasteryUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
  }

  export type TopicUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput> | TopicCreateWithoutParentInput[] | TopicUncheckedCreateWithoutParentInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutParentInput | TopicCreateOrConnectWithoutParentInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutParentInput | TopicUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: TopicCreateManyParentInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutParentInput | TopicUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutParentInput | TopicUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type TopicInteractionUncheckedUpdateManyWithoutTopicNestedInput = {
    set?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    disconnect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    delete?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    connect?: TopicInteractionWhereUniqueInput | TopicInteractionWhereUniqueInput[]
    update?: TopicInteractionUpdateWithWhereUniqueWithoutTopicInput | TopicInteractionUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicInteractionUpdateManyWithWhereWithoutTopicInput | TopicInteractionUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
  }

  export type TopicMasteryUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput> | TopicMasteryCreateWithoutTopicInput[] | TopicMasteryUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: TopicMasteryCreateOrConnectWithoutTopicInput | TopicMasteryCreateOrConnectWithoutTopicInput[]
    upsert?: TopicMasteryUpsertWithWhereUniqueWithoutTopicInput | TopicMasteryUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: TopicMasteryCreateManyTopicInputEnvelope
    set?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    disconnect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    delete?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    connect?: TopicMasteryWhereUniqueInput | TopicMasteryWhereUniqueInput[]
    update?: TopicMasteryUpdateWithWhereUniqueWithoutTopicInput | TopicMasteryUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: TopicMasteryUpdateManyWithWhereWithoutTopicInput | TopicMasteryUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TopicInteractionUpdatecitedSectionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutTopicInteractionsNestedInput = {
    create?: XOR<UserCreateWithoutTopicInteractionsInput, UserUncheckedCreateWithoutTopicInteractionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTopicInteractionsInput
    upsert?: UserUpsertWithoutTopicInteractionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTopicInteractionsInput, UserUpdateWithoutTopicInteractionsInput>, UserUncheckedUpdateWithoutTopicInteractionsInput>
  }

  export type TopicUpdateOneRequiredWithoutInteractionsNestedInput = {
    create?: XOR<TopicCreateWithoutInteractionsInput, TopicUncheckedCreateWithoutInteractionsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutInteractionsInput
    upsert?: TopicUpsertWithoutInteractionsInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutInteractionsInput, TopicUpdateWithoutInteractionsInput>, TopicUncheckedUpdateWithoutInteractionsInput>
  }

  export type TopicMasteryCreatesubtopicsExploredInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutTopicMasteriesInput = {
    create?: XOR<UserCreateWithoutTopicMasteriesInput, UserUncheckedCreateWithoutTopicMasteriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTopicMasteriesInput
    connect?: UserWhereUniqueInput
  }

  export type TopicCreateNestedOneWithoutMasteriesInput = {
    create?: XOR<TopicCreateWithoutMasteriesInput, TopicUncheckedCreateWithoutMasteriesInput>
    connectOrCreate?: TopicCreateOrConnectWithoutMasteriesInput
    connect?: TopicWhereUniqueInput
  }

  export type EnumMasteryStatusFieldUpdateOperationsInput = {
    set?: $Enums.MasteryStatus
  }

  export type TopicMasteryUpdatesubtopicsExploredInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutTopicMasteriesNestedInput = {
    create?: XOR<UserCreateWithoutTopicMasteriesInput, UserUncheckedCreateWithoutTopicMasteriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTopicMasteriesInput
    upsert?: UserUpsertWithoutTopicMasteriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTopicMasteriesInput, UserUpdateWithoutTopicMasteriesInput>, UserUncheckedUpdateWithoutTopicMasteriesInput>
  }

  export type TopicUpdateOneRequiredWithoutMasteriesNestedInput = {
    create?: XOR<TopicCreateWithoutMasteriesInput, TopicUncheckedCreateWithoutMasteriesInput>
    connectOrCreate?: TopicCreateOrConnectWithoutMasteriesInput
    upsert?: TopicUpsertWithoutMasteriesInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutMasteriesInput, TopicUpdateWithoutMasteriesInput>, TopicUncheckedUpdateWithoutMasteriesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDocumentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusFilter<$PrismaModel> | $Enums.DocumentStatus
  }

  export type NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocumentStatus | EnumDocumentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DocumentStatus[] | ListEnumDocumentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDocumentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DocumentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocumentStatusFilter<$PrismaModel>
    _max?: NestedEnumDocumentStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumMasteryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MasteryStatus | EnumMasteryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMasteryStatusFilter<$PrismaModel> | $Enums.MasteryStatus
  }

  export type NestedEnumMasteryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MasteryStatus | EnumMasteryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MasteryStatus[] | ListEnumMasteryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMasteryStatusWithAggregatesFilter<$PrismaModel> | $Enums.MasteryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMasteryStatusFilter<$PrismaModel>
    _max?: NestedEnumMasteryStatusFilter<$PrismaModel>
  }

  export type NoteCreateWithoutUserInput = {
    id?: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
  }

  export type NoteUncheckedCreateWithoutUserInput = {
    id?: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
  }

  export type NoteCreateOrConnectWithoutUserInput = {
    where: NoteWhereUniqueInput
    create: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput>
  }

  export type NoteCreateManyUserInputEnvelope = {
    data: NoteCreateManyUserInput | NoteCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProgressCreateWithoutUserInput = {
    id?: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
  }

  export type ProgressUncheckedCreateWithoutUserInput = {
    id?: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
  }

  export type ProgressCreateOrConnectWithoutUserInput = {
    where: ProgressWhereUniqueInput
    create: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
  }

  export type ProgressCreateManyUserInputEnvelope = {
    data: ProgressCreateManyUserInput | ProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutUserInput = {
    id?: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    embeddings?: EmbeddingCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutUserInput = {
    id?: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutUserInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput>
  }

  export type DocumentCreateManyUserInputEnvelope = {
    data: DocumentCreateManyUserInput | DocumentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EmbeddingCreateWithoutUserInput = {
    id?: string
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
    document?: DocumentCreateNestedOneWithoutEmbeddingsInput
  }

  export type EmbeddingUncheckedCreateWithoutUserInput = {
    id?: string
    documentId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type EmbeddingCreateOrConnectWithoutUserInput = {
    where: EmbeddingWhereUniqueInput
    create: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput>
  }

  export type EmbeddingCreateManyUserInputEnvelope = {
    data: EmbeddingCreateManyUserInput | EmbeddingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TopicMasteryCreateWithoutUserInput = {
    id?: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    topic: TopicCreateNestedOneWithoutMasteriesInput
  }

  export type TopicMasteryUncheckedCreateWithoutUserInput = {
    id?: string
    topicId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type TopicMasteryCreateOrConnectWithoutUserInput = {
    where: TopicMasteryWhereUniqueInput
    create: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput>
  }

  export type TopicMasteryCreateManyUserInputEnvelope = {
    data: TopicMasteryCreateManyUserInput | TopicMasteryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NoteUpsertWithWhereUniqueWithoutUserInput = {
    where: NoteWhereUniqueInput
    update: XOR<NoteUpdateWithoutUserInput, NoteUncheckedUpdateWithoutUserInput>
    create: XOR<NoteCreateWithoutUserInput, NoteUncheckedCreateWithoutUserInput>
  }

  export type NoteUpdateWithWhereUniqueWithoutUserInput = {
    where: NoteWhereUniqueInput
    data: XOR<NoteUpdateWithoutUserInput, NoteUncheckedUpdateWithoutUserInput>
  }

  export type NoteUpdateManyWithWhereWithoutUserInput = {
    where: NoteScalarWhereInput
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyWithoutUserInput>
  }

  export type NoteScalarWhereInput = {
    AND?: NoteScalarWhereInput | NoteScalarWhereInput[]
    OR?: NoteScalarWhereInput[]
    NOT?: NoteScalarWhereInput | NoteScalarWhereInput[]
    id?: StringFilter<"Note"> | string
    userId?: StringFilter<"Note"> | string
    document?: StringFilter<"Note"> | string
    page?: IntFilter<"Note"> | number
    content?: StringFilter<"Note"> | string
    createdAt?: DateTimeFilter<"Note"> | Date | string
  }

  export type ProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: ProgressWhereUniqueInput
    update: XOR<ProgressUpdateWithoutUserInput, ProgressUncheckedUpdateWithoutUserInput>
    create: XOR<ProgressCreateWithoutUserInput, ProgressUncheckedCreateWithoutUserInput>
  }

  export type ProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: ProgressWhereUniqueInput
    data: XOR<ProgressUpdateWithoutUserInput, ProgressUncheckedUpdateWithoutUserInput>
  }

  export type ProgressUpdateManyWithWhereWithoutUserInput = {
    where: ProgressScalarWhereInput
    data: XOR<ProgressUpdateManyMutationInput, ProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type ProgressScalarWhereInput = {
    AND?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
    OR?: ProgressScalarWhereInput[]
    NOT?: ProgressScalarWhereInput | ProgressScalarWhereInput[]
    id?: StringFilter<"Progress"> | string
    userId?: StringFilter<"Progress"> | string
    document?: StringFilter<"Progress"> | string
    pagesRead?: IntFilter<"Progress"> | number
    minutes?: IntFilter<"Progress"> | number
    date?: DateTimeFilter<"Progress"> | Date | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutUserInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutUserInput, DocumentUncheckedUpdateWithoutUserInput>
    create: XOR<DocumentCreateWithoutUserInput, DocumentUncheckedCreateWithoutUserInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutUserInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutUserInput, DocumentUncheckedUpdateWithoutUserInput>
  }

  export type DocumentUpdateManyWithWhereWithoutUserInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutUserInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    userId?: StringFilter<"Document"> | string
    filename?: StringFilter<"Document"> | string
    originalName?: StringFilter<"Document"> | string
    contentHash?: StringFilter<"Document"> | string
    fileSize?: IntFilter<"Document"> | number
    mimeType?: StringNullableFilter<"Document"> | string | null
    status?: EnumDocumentStatusFilter<"Document"> | $Enums.DocumentStatus
    isSystemDocument?: BoolFilter<"Document"> | boolean
    totalChunks?: IntNullableFilter<"Document"> | number | null
    processedChunks?: IntFilter<"Document"> | number
    processingError?: StringNullableFilter<"Document"> | string | null
    startedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"Document"> | Date | string | null
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type EmbeddingUpsertWithWhereUniqueWithoutUserInput = {
    where: EmbeddingWhereUniqueInput
    update: XOR<EmbeddingUpdateWithoutUserInput, EmbeddingUncheckedUpdateWithoutUserInput>
    create: XOR<EmbeddingCreateWithoutUserInput, EmbeddingUncheckedCreateWithoutUserInput>
  }

  export type EmbeddingUpdateWithWhereUniqueWithoutUserInput = {
    where: EmbeddingWhereUniqueInput
    data: XOR<EmbeddingUpdateWithoutUserInput, EmbeddingUncheckedUpdateWithoutUserInput>
  }

  export type EmbeddingUpdateManyWithWhereWithoutUserInput = {
    where: EmbeddingScalarWhereInput
    data: XOR<EmbeddingUpdateManyMutationInput, EmbeddingUncheckedUpdateManyWithoutUserInput>
  }

  export type EmbeddingScalarWhereInput = {
    AND?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
    OR?: EmbeddingScalarWhereInput[]
    NOT?: EmbeddingScalarWhereInput | EmbeddingScalarWhereInput[]
    id?: StringFilter<"Embedding"> | string
    userId?: StringNullableFilter<"Embedding"> | string | null
    documentId?: StringNullableFilter<"Embedding"> | string | null
    source?: StringFilter<"Embedding"> | string
    chunk?: StringFilter<"Embedding"> | string
    embedding?: JsonFilter<"Embedding">
    documentType?: StringNullableFilter<"Embedding"> | string | null
    chunkIndex?: IntNullableFilter<"Embedding"> | number | null
    totalChunks?: IntNullableFilter<"Embedding"> | number | null
    section?: StringNullableFilter<"Embedding"> | string | null
    startLine?: IntNullableFilter<"Embedding"> | number | null
    endLine?: IntNullableFilter<"Embedding"> | number | null
    chunkingConfig?: JsonNullableFilter<"Embedding">
    sectionLevel?: IntNullableFilter<"Embedding"> | number | null
    pageStart?: IntNullableFilter<"Embedding"> | number | null
    pageEnd?: IntNullableFilter<"Embedding"> | number | null
    hasTable?: BoolFilter<"Embedding"> | boolean
    hasImage?: BoolFilter<"Embedding"> | boolean
    wordCount?: IntNullableFilter<"Embedding"> | number | null
    createdAt?: DateTimeFilter<"Embedding"> | Date | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    userId?: StringFilter<"RefreshToken"> | string
    token?: StringFilter<"RefreshToken"> | string
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type TopicInteractionUpdateWithWhereUniqueWithoutUserInput = {
    where: TopicInteractionWhereUniqueInput
    data: XOR<TopicInteractionUpdateWithoutUserInput, TopicInteractionUncheckedUpdateWithoutUserInput>
  }

  export type TopicInteractionUpdateManyWithWhereWithoutUserInput = {
    where: TopicInteractionScalarWhereInput
    data: XOR<TopicInteractionUpdateManyMutationInput, TopicInteractionUncheckedUpdateManyWithoutUserInput>
  }

  export type TopicInteractionScalarWhereInput = {
    AND?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
    OR?: TopicInteractionScalarWhereInput[]
    NOT?: TopicInteractionScalarWhereInput | TopicInteractionScalarWhereInput[]
    id?: StringFilter<"TopicInteraction"> | string
    userId?: StringFilter<"TopicInteraction"> | string
    topicId?: StringFilter<"TopicInteraction"> | string
    query?: StringFilter<"TopicInteraction"> | string
    mappingConfidence?: FloatFilter<"TopicInteraction"> | number
    ragConfidence?: StringFilter<"TopicInteraction"> | string
    ragTopScore?: FloatFilter<"TopicInteraction"> | number
    citedSections?: StringNullableListFilter<"TopicInteraction">
    answerLength?: IntFilter<"TopicInteraction"> | number
    citationCount?: IntFilter<"TopicInteraction"> | number
    timeSpentMs?: IntNullableFilter<"TopicInteraction"> | number | null
    hadFollowUp?: BoolFilter<"TopicInteraction"> | boolean
    createdAt?: DateTimeFilter<"TopicInteraction"> | Date | string
  }

  export type TopicMasteryUpsertWithWhereUniqueWithoutUserInput = {
    where: TopicMasteryWhereUniqueInput
    update: XOR<TopicMasteryUpdateWithoutUserInput, TopicMasteryUncheckedUpdateWithoutUserInput>
    create: XOR<TopicMasteryCreateWithoutUserInput, TopicMasteryUncheckedCreateWithoutUserInput>
  }

  export type TopicMasteryUpdateWithWhereUniqueWithoutUserInput = {
    where: TopicMasteryWhereUniqueInput
    data: XOR<TopicMasteryUpdateWithoutUserInput, TopicMasteryUncheckedUpdateWithoutUserInput>
  }

  export type TopicMasteryUpdateManyWithWhereWithoutUserInput = {
    where: TopicMasteryScalarWhereInput
    data: XOR<TopicMasteryUpdateManyMutationInput, TopicMasteryUncheckedUpdateManyWithoutUserInput>
  }

  export type TopicMasteryScalarWhereInput = {
    AND?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
    OR?: TopicMasteryScalarWhereInput[]
    NOT?: TopicMasteryScalarWhereInput | TopicMasteryScalarWhereInput[]
    id?: StringFilter<"TopicMastery"> | string
    userId?: StringFilter<"TopicMastery"> | string
    topicId?: StringFilter<"TopicMastery"> | string
    masteryLevel?: FloatFilter<"TopicMastery"> | number
    status?: EnumMasteryStatusFilter<"TopicMastery"> | $Enums.MasteryStatus
    questionsAsked?: IntFilter<"TopicMastery"> | number
    coverageScore?: FloatFilter<"TopicMastery"> | number
    depthScore?: FloatFilter<"TopicMastery"> | number
    confidenceScore?: FloatFilter<"TopicMastery"> | number
    diversityScore?: FloatFilter<"TopicMastery"> | number
    retentionScore?: FloatFilter<"TopicMastery"> | number
    subtopicsExplored?: StringNullableListFilter<"TopicMastery">
    firstInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    lastInteraction?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"TopicMastery"> | Date | string | null
    updatedAt?: DateTimeFilter<"TopicMastery"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNotesInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotesInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
  }

  export type UserUpsertWithoutNotesInput = {
    update: XOR<UserUpdateWithoutNotesInput, UserUncheckedUpdateWithoutNotesInput>
    create: XOR<UserCreateWithoutNotesInput, UserUncheckedCreateWithoutNotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotesInput, UserUncheckedUpdateWithoutNotesInput>
  }

  export type UserUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutProgressInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgressInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
  }

  export type UserUpsertWithoutProgressInput = {
    update: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
  }

  export type UserUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDocumentsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDocumentsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
  }

  export type EmbeddingCreateWithoutDocumentInput = {
    id?: string
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutEmbeddingsInput
  }

  export type EmbeddingUncheckedCreateWithoutDocumentInput = {
    id?: string
    userId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type EmbeddingCreateOrConnectWithoutDocumentInput = {
    where: EmbeddingWhereUniqueInput
    create: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput>
  }

  export type EmbeddingCreateManyDocumentInputEnvelope = {
    data: EmbeddingCreateManyDocumentInput | EmbeddingCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutDocumentsInput = {
    update: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EmbeddingUpsertWithWhereUniqueWithoutDocumentInput = {
    where: EmbeddingWhereUniqueInput
    update: XOR<EmbeddingUpdateWithoutDocumentInput, EmbeddingUncheckedUpdateWithoutDocumentInput>
    create: XOR<EmbeddingCreateWithoutDocumentInput, EmbeddingUncheckedCreateWithoutDocumentInput>
  }

  export type EmbeddingUpdateWithWhereUniqueWithoutDocumentInput = {
    where: EmbeddingWhereUniqueInput
    data: XOR<EmbeddingUpdateWithoutDocumentInput, EmbeddingUncheckedUpdateWithoutDocumentInput>
  }

  export type EmbeddingUpdateManyWithWhereWithoutDocumentInput = {
    where: EmbeddingScalarWhereInput
    data: XOR<EmbeddingUpdateManyMutationInput, EmbeddingUncheckedUpdateManyWithoutDocumentInput>
  }

  export type UserCreateWithoutEmbeddingsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEmbeddingsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEmbeddingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEmbeddingsInput, UserUncheckedCreateWithoutEmbeddingsInput>
  }

  export type DocumentCreateWithoutEmbeddingsInput = {
    id?: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutEmbeddingsInput = {
    id?: string
    userId: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutEmbeddingsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutEmbeddingsInput, DocumentUncheckedCreateWithoutEmbeddingsInput>
  }

  export type UserUpsertWithoutEmbeddingsInput = {
    update: XOR<UserUpdateWithoutEmbeddingsInput, UserUncheckedUpdateWithoutEmbeddingsInput>
    create: XOR<UserCreateWithoutEmbeddingsInput, UserUncheckedCreateWithoutEmbeddingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEmbeddingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEmbeddingsInput, UserUncheckedUpdateWithoutEmbeddingsInput>
  }

  export type UserUpdateWithoutEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithoutEmbeddingsInput = {
    update: XOR<DocumentUpdateWithoutEmbeddingsInput, DocumentUncheckedUpdateWithoutEmbeddingsInput>
    create: XOR<DocumentCreateWithoutEmbeddingsInput, DocumentUncheckedCreateWithoutEmbeddingsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutEmbeddingsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutEmbeddingsInput, DocumentUncheckedUpdateWithoutEmbeddingsInput>
  }

  export type DocumentUpdateWithoutEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutEmbeddingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateWithoutChildrenInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    parent?: TopicCreateNestedOneWithoutChildrenInput
    interactions?: TopicInteractionCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutChildrenInput = {
    id: string
    level: number
    name: string
    slug: string
    parentId?: string | null
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    interactions?: TopicInteractionUncheckedCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutChildrenInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutChildrenInput, TopicUncheckedCreateWithoutChildrenInput>
  }

  export type TopicCreateWithoutParentInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    children?: TopicCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutParentInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    children?: TopicUncheckedCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionUncheckedCreateNestedManyWithoutTopicInput
    masteries?: TopicMasteryUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutParentInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput>
  }

  export type TopicCreateManyParentInputEnvelope = {
    data: TopicCreateManyParentInput | TopicCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type TopicMasteryCreateWithoutTopicInput = {
    id?: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTopicMasteriesInput
  }

  export type TopicMasteryUncheckedCreateWithoutTopicInput = {
    id?: string
    userId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type TopicMasteryCreateOrConnectWithoutTopicInput = {
    where: TopicMasteryWhereUniqueInput
    create: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput>
  }

  export type TopicMasteryCreateManyTopicInputEnvelope = {
    data: TopicMasteryCreateManyTopicInput | TopicMasteryCreateManyTopicInput[]
    skipDuplicates?: boolean
  }

  export type TopicUpsertWithoutChildrenInput = {
    update: XOR<TopicUpdateWithoutChildrenInput, TopicUncheckedUpdateWithoutChildrenInput>
    create: XOR<TopicCreateWithoutChildrenInput, TopicUncheckedCreateWithoutChildrenInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutChildrenInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutChildrenInput, TopicUncheckedUpdateWithoutChildrenInput>
  }

  export type TopicUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: TopicUpdateOneWithoutChildrenNestedInput
    interactions?: TopicInteractionUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    interactions?: TopicInteractionUncheckedUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicUpsertWithWhereUniqueWithoutParentInput = {
    where: TopicWhereUniqueInput
    update: XOR<TopicUpdateWithoutParentInput, TopicUncheckedUpdateWithoutParentInput>
    create: XOR<TopicCreateWithoutParentInput, TopicUncheckedCreateWithoutParentInput>
  }

  export type TopicUpdateWithWhereUniqueWithoutParentInput = {
    where: TopicWhereUniqueInput
    data: XOR<TopicUpdateWithoutParentInput, TopicUncheckedUpdateWithoutParentInput>
  }

  export type TopicUpdateManyWithWhereWithoutParentInput = {
    where: TopicScalarWhereInput
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyWithoutParentInput>
  }

  export type TopicScalarWhereInput = {
    AND?: TopicScalarWhereInput | TopicScalarWhereInput[]
    OR?: TopicScalarWhereInput[]
    NOT?: TopicScalarWhereInput | TopicScalarWhereInput[]
    id?: StringFilter<"Topic"> | string
    level?: IntFilter<"Topic"> | number
    name?: StringFilter<"Topic"> | string
    slug?: StringFilter<"Topic"> | string
    parentId?: StringNullableFilter<"Topic"> | string | null
    chapterNum?: IntNullableFilter<"Topic"> | number | null
    keywords?: StringNullableListFilter<"Topic">
    aliases?: StringNullableListFilter<"Topic">
    expectedQuestions?: IntFilter<"Topic"> | number
    createdAt?: DateTimeFilter<"Topic"> | Date | string
  }

  export type TopicInteractionUpdateWithWhereUniqueWithoutTopicInput = {
    where: TopicInteractionWhereUniqueInput
    data: XOR<TopicInteractionUpdateWithoutTopicInput, TopicInteractionUncheckedUpdateWithoutTopicInput>
  }

  export type TopicInteractionUpdateManyWithWhereWithoutTopicInput = {
    where: TopicInteractionScalarWhereInput
    data: XOR<TopicInteractionUpdateManyMutationInput, TopicInteractionUncheckedUpdateManyWithoutTopicInput>
  }

  export type TopicMasteryUpsertWithWhereUniqueWithoutTopicInput = {
    where: TopicMasteryWhereUniqueInput
    update: XOR<TopicMasteryUpdateWithoutTopicInput, TopicMasteryUncheckedUpdateWithoutTopicInput>
    create: XOR<TopicMasteryCreateWithoutTopicInput, TopicMasteryUncheckedCreateWithoutTopicInput>
  }

  export type TopicMasteryUpdateWithWhereUniqueWithoutTopicInput = {
    where: TopicMasteryWhereUniqueInput
    data: XOR<TopicMasteryUpdateWithoutTopicInput, TopicMasteryUncheckedUpdateWithoutTopicInput>
  }

  export type TopicMasteryUpdateManyWithWhereWithoutTopicInput = {
    where: TopicMasteryScalarWhereInput
    data: XOR<TopicMasteryUpdateManyMutationInput, TopicMasteryUncheckedUpdateManyWithoutTopicInput>
  }

  export type UserCreateWithoutTopicInteractionsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTopicInteractionsInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicMasteries?: TopicMasteryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTopicInteractionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTopicInteractionsInput, UserUncheckedCreateWithoutTopicInteractionsInput>
  }

  export type UserUpsertWithoutTopicInteractionsInput = {
    update: XOR<UserUpdateWithoutTopicInteractionsInput, UserUncheckedUpdateWithoutTopicInteractionsInput>
    create: XOR<UserCreateWithoutTopicInteractionsInput, UserUncheckedCreateWithoutTopicInteractionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTopicInteractionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTopicInteractionsInput, UserUncheckedUpdateWithoutTopicInteractionsInput>
  }

  export type UserUpdateWithoutTopicInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTopicInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicMasteries?: TopicMasteryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TopicCreateWithoutInteractionsInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    parent?: TopicCreateNestedOneWithoutChildrenInput
    children?: TopicCreateNestedManyWithoutParentInput
    masteries?: TopicMasteryCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutInteractionsInput = {
    id: string
    level: number
    name: string
    slug: string
    parentId?: string | null
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    children?: TopicUncheckedCreateNestedManyWithoutParentInput
    masteries?: TopicMasteryUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutInteractionsInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutInteractionsInput, TopicUncheckedCreateWithoutInteractionsInput>
  }

  export type TopicUpsertWithoutInteractionsInput = {
    update: XOR<TopicUpdateWithoutInteractionsInput, TopicUncheckedUpdateWithoutInteractionsInput>
    create: XOR<TopicCreateWithoutInteractionsInput, TopicUncheckedCreateWithoutInteractionsInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutInteractionsInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutInteractionsInput, TopicUncheckedUpdateWithoutInteractionsInput>
  }

  export type TopicUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: TopicUpdateOneWithoutChildrenNestedInput
    children?: TopicUpdateManyWithoutParentNestedInput
    masteries?: TopicMasteryUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: TopicUncheckedUpdateManyWithoutParentNestedInput
    masteries?: TopicMasteryUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type UserCreateWithoutTopicMasteriesInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteCreateNestedManyWithoutUserInput
    progress?: ProgressCreateNestedManyWithoutUserInput
    documents?: DocumentCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTopicMasteriesInput = {
    id?: string
    email: string
    passwordHash: string
    role?: $Enums.Role
    isVerified?: boolean
    failedLogins?: number
    lockedUntil?: Date | string | null
    verificationToken?: string | null
    verificationExpires?: Date | string | null
    resetToken?: string | null
    resetTokenExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    notes?: NoteUncheckedCreateNestedManyWithoutUserInput
    progress?: ProgressUncheckedCreateNestedManyWithoutUserInput
    documents?: DocumentUncheckedCreateNestedManyWithoutUserInput
    embeddings?: EmbeddingUncheckedCreateNestedManyWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    topicInteractions?: TopicInteractionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTopicMasteriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTopicMasteriesInput, UserUncheckedCreateWithoutTopicMasteriesInput>
  }

  export type TopicCreateWithoutMasteriesInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    parent?: TopicCreateNestedOneWithoutChildrenInput
    children?: TopicCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutMasteriesInput = {
    id: string
    level: number
    name: string
    slug: string
    parentId?: string | null
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
    children?: TopicUncheckedCreateNestedManyWithoutParentInput
    interactions?: TopicInteractionUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutMasteriesInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutMasteriesInput, TopicUncheckedCreateWithoutMasteriesInput>
  }

  export type UserUpsertWithoutTopicMasteriesInput = {
    update: XOR<UserUpdateWithoutTopicMasteriesInput, UserUncheckedUpdateWithoutTopicMasteriesInput>
    create: XOR<UserCreateWithoutTopicMasteriesInput, UserUncheckedCreateWithoutTopicMasteriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTopicMasteriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTopicMasteriesInput, UserUncheckedUpdateWithoutTopicMasteriesInput>
  }

  export type UserUpdateWithoutTopicMasteriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUpdateManyWithoutUserNestedInput
    progress?: ProgressUpdateManyWithoutUserNestedInput
    documents?: DocumentUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTopicMasteriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    failedLogins?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationToken?: NullableStringFieldUpdateOperationsInput | string | null
    verificationExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NoteUncheckedUpdateManyWithoutUserNestedInput
    progress?: ProgressUncheckedUpdateManyWithoutUserNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutUserNestedInput
    embeddings?: EmbeddingUncheckedUpdateManyWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    topicInteractions?: TopicInteractionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TopicUpsertWithoutMasteriesInput = {
    update: XOR<TopicUpdateWithoutMasteriesInput, TopicUncheckedUpdateWithoutMasteriesInput>
    create: XOR<TopicCreateWithoutMasteriesInput, TopicUncheckedCreateWithoutMasteriesInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutMasteriesInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutMasteriesInput, TopicUncheckedUpdateWithoutMasteriesInput>
  }

  export type TopicUpdateWithoutMasteriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    parent?: TopicUpdateOneWithoutChildrenNestedInput
    children?: TopicUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutMasteriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: TopicUncheckedUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type NoteCreateManyUserInput = {
    id?: string
    document: string
    page: number
    content: string
    createdAt?: Date | string
  }

  export type ProgressCreateManyUserInput = {
    id?: string
    document: string
    pagesRead?: number
    minutes?: number
    date?: Date | string
  }

  export type DocumentCreateManyUserInput = {
    id?: string
    filename: string
    originalName: string
    contentHash: string
    fileSize: number
    mimeType?: string | null
    status?: $Enums.DocumentStatus
    isSystemDocument?: boolean
    totalChunks?: number | null
    processedChunks?: number
    processingError?: string | null
    startedAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmbeddingCreateManyUserInput = {
    id?: string
    documentId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type TopicMasteryCreateManyUserInput = {
    id?: string
    topicId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type NoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    page?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    pagesRead?: IntFieldUpdateOperationsInput | number
    minutes?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    embeddings?: EmbeddingUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    embeddings?: EmbeddingUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    contentHash?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumDocumentStatusFieldUpdateOperationsInput | $Enums.DocumentStatus
    isSystemDocument?: BoolFieldUpdateOperationsInput | boolean
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    processedChunks?: IntFieldUpdateOperationsInput | number
    processingError?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneWithoutEmbeddingsNestedInput
  }

  export type EmbeddingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: TopicUpdateOneRequiredWithoutInteractionsNestedInput
  }

  export type TopicInteractionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: TopicUpdateOneRequiredWithoutMasteriesNestedInput
  }

  export type TopicMasteryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    topicId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingCreateManyDocumentInput = {
    id?: string
    userId?: string | null
    source: string
    chunk: string
    embedding: JsonNullValueInput | InputJsonValue
    documentType?: string | null
    chunkIndex?: number | null
    totalChunks?: number | null
    section?: string | null
    startLine?: number | null
    endLine?: number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: number | null
    pageStart?: number | null
    pageEnd?: number | null
    hasTable?: boolean
    hasImage?: boolean
    wordCount?: number | null
    createdAt?: Date | string
  }

  export type EmbeddingUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEmbeddingsNestedInput
  }

  export type EmbeddingUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmbeddingUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    chunk?: StringFieldUpdateOperationsInput | string
    embedding?: JsonNullValueInput | InputJsonValue
    documentType?: NullableStringFieldUpdateOperationsInput | string | null
    chunkIndex?: NullableIntFieldUpdateOperationsInput | number | null
    totalChunks?: NullableIntFieldUpdateOperationsInput | number | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    startLine?: NullableIntFieldUpdateOperationsInput | number | null
    endLine?: NullableIntFieldUpdateOperationsInput | number | null
    chunkingConfig?: NullableJsonNullValueInput | InputJsonValue
    sectionLevel?: NullableIntFieldUpdateOperationsInput | number | null
    pageStart?: NullableIntFieldUpdateOperationsInput | number | null
    pageEnd?: NullableIntFieldUpdateOperationsInput | number | null
    hasTable?: BoolFieldUpdateOperationsInput | boolean
    hasImage?: BoolFieldUpdateOperationsInput | boolean
    wordCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateManyParentInput = {
    id: string
    level: number
    name: string
    slug: string
    chapterNum?: number | null
    keywords?: TopicCreatekeywordsInput | string[]
    aliases?: TopicCreatealiasesInput | string[]
    expectedQuestions?: number
    createdAt?: Date | string
  }

  export type TopicMasteryCreateManyTopicInput = {
    id?: string
    userId: string
    masteryLevel?: number
    status: $Enums.MasteryStatus
    questionsAsked?: number
    coverageScore?: number
    depthScore?: number
    confidenceScore?: number
    diversityScore?: number
    retentionScore?: number
    subtopicsExplored?: TopicMasteryCreatesubtopicsExploredInput | string[]
    firstInteraction?: Date | string | null
    lastInteraction?: Date | string | null
    completedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type TopicUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: TopicUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    children?: TopicUncheckedUpdateManyWithoutParentNestedInput
    interactions?: TopicInteractionUncheckedUpdateManyWithoutTopicNestedInput
    masteries?: TopicMasteryUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    chapterNum?: NullableIntFieldUpdateOperationsInput | number | null
    keywords?: TopicUpdatekeywordsInput | string[]
    aliases?: TopicUpdatealiasesInput | string[]
    expectedQuestions?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicInteractionsNestedInput
  }

  export type TopicInteractionUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicInteractionUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    query?: StringFieldUpdateOperationsInput | string
    mappingConfidence?: FloatFieldUpdateOperationsInput | number
    ragConfidence?: StringFieldUpdateOperationsInput | string
    ragTopScore?: FloatFieldUpdateOperationsInput | number
    citedSections?: TopicInteractionUpdatecitedSectionsInput | string[]
    answerLength?: IntFieldUpdateOperationsInput | number
    citationCount?: IntFieldUpdateOperationsInput | number
    timeSpentMs?: NullableIntFieldUpdateOperationsInput | number | null
    hadFollowUp?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTopicMasteriesNestedInput
  }

  export type TopicMasteryUncheckedUpdateWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicMasteryUncheckedUpdateManyWithoutTopicInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    masteryLevel?: FloatFieldUpdateOperationsInput | number
    status?: EnumMasteryStatusFieldUpdateOperationsInput | $Enums.MasteryStatus
    questionsAsked?: IntFieldUpdateOperationsInput | number
    coverageScore?: FloatFieldUpdateOperationsInput | number
    depthScore?: FloatFieldUpdateOperationsInput | number
    confidenceScore?: FloatFieldUpdateOperationsInput | number
    diversityScore?: FloatFieldUpdateOperationsInput | number
    retentionScore?: FloatFieldUpdateOperationsInput | number
    subtopicsExplored?: TopicMasteryUpdatesubtopicsExploredInput | string[]
    firstInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInteraction?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentCountOutputTypeDefaultArgs instead
     */
    export type DocumentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TopicCountOutputTypeDefaultArgs instead
     */
    export type TopicCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TopicCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RefreshTokenDefaultArgs instead
     */
    export type RefreshTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RefreshTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NoteDefaultArgs instead
     */
    export type NoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NoteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProgressDefaultArgs instead
     */
    export type ProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProgressDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DocumentDefaultArgs instead
     */
    export type DocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EmbeddingDefaultArgs instead
     */
    export type EmbeddingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EmbeddingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RetrievalLogDefaultArgs instead
     */
    export type RetrievalLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RetrievalLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TopicDefaultArgs instead
     */
    export type TopicArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TopicDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TopicInteractionDefaultArgs instead
     */
    export type TopicInteractionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TopicInteractionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TopicMasteryDefaultArgs instead
     */
    export type TopicMasteryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TopicMasteryDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}