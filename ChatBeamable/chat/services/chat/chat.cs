using Beamable.Common;
using Beamable.Common.Api.Social;
using Beamable.Experimental.Api.Chat;
using Beamable.Server;
using MongoDB.Driver;
using MongoDB.Driver.Core.Servers;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using static Beamable.Server.chatStorage;


namespace Beamable.chat
{
    [Microservice("chat")]
    public class chat : Microservice
    {

        [ClientCallable]
        public async Promise<UserMessage> SaveMessage(string message, string receiver, string sender)
        {
            try
            {
                var db = await Storage.GetDatabase<chatStorage>();
                var collection = db.GetCollection<UserMessage>("messages");
                var newMessage = new UserMessage()
                {
                    Message = message,
                    Receiver = receiver,
                    Sender = sender
                };
                collection.InsertOne(newMessage);
                return newMessage;

            }
            catch (Exception e)
            {
                Console.WriteLine($"Error saving message: {e.Message}");
                return null;
            }
        }

        [ClientCallable]
        public async Promise<List<string>> GetMessage(string sender, string receiver)
        {
            var db = await Storage.GetDatabase<chatStorage>();
            var collection = db.GetCollection<UserMessage>("messages");
            var messages = collection
               .Find(document => ((document.Receiver == sender) && (document.Sender == receiver)) || ((document.Sender == sender) && (document.Receiver == receiver) ))
               .ToList();

            return messages.Select(m => m.Message).ToList();
        }
    }

}