using Beamable.Server;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace Beamable.Server
{
    /// <summary>
    /// This class represents the existence of the chatStorage database.
    /// Use it for type safe access to the database.
    /// <code>
    /// var db = await Storage.GetDatabase&lt;chatStorage&gt;();
    /// </code>
    /// </summary>
    [StorageObject("chatStorage")]
    public class chatStorage : MongoStorageObject
    {

    }

    public class UserMessage
    {
        public ObjectId Id;
        public string Message;
        public string Receiver;
        public string Sender;
    }
}