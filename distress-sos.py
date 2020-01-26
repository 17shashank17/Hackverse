from requests import get
from json import loads

class DistressSOSHandler(object):

    def usage(self) -> str:
        return '''
               this bot responds with distress locations for the rescue teams to react upon.
               usage:
                    - @distresssos report : displays locations where distress was registered.
                    - @distresssos rescue <int> : rescue a person from distress location
               '''

    def handle_message(self, message, bot_handler):
        try:
            if len(message['content']) >= 6 and message['content'][:6] == 'report':
                data = loads(get('http://hackverse-gods.herokuapp.com/get_all_distress_locations').content)
                if len(data) == 0:
                    bot_handler.send_reply(message, 'All good! No distress locations found.')
                    return
                resp = f'SOS! Distress {len(data)} locations detected\n'
                for idx, d in enumerate(data):
                    resp += f'\t{idx+1}.  Latitude: {d["latitude"]}, Longitude: {d["longitude"]}\n'
                bot_handler.send_reply(message, resp)
            elif len(message['content']) >= 6 and message['content'][:6] == 'rescue':
                data = loads(get('http://hackverse-gods.herokuapp.com/get_all_distress_locations').content)
                rescue_loc = data[int(message['content'][6:])-1]
                get(f'http://hackverse-gods.herokuapp.com/rescue?latitude={rescue_loc["latitude"]}&longitude={rescue_loc["longitude"]}')
                bot_handler.send_reply(message, 'rescued!')
            else:
                bot_handler.send_reply(message, self.usage())
        except:
            bot_handler.send_reply(message, '500 error')


handler_class = DistressSOSHandler