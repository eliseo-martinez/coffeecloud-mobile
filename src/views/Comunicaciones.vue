<template>
  <v-content>
    <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showEdition="false"
      :showDeletion="false"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="false"
      :showCloseButton="false"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      :placeholder="placeholder"
      @onType="handleOnType"
      @edit="editMessage">
      <template v-slot:header>
        <div style="text-align:center;margin:auto;">Comunicarse con técnicos de: 
        <v-img :src="logo_white" :contain="true" min-height="35" max-height="50" style="padding:5px;margin:10px;"></v-img>
        </div>
      </template>
      
    </beautiful-chat>
      
  </div>
  <v-overlay :value="overlay" style="z-index:1050">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      {{ status }}
    </v-overlay>
  </v-content>
</template>

<script>
import CloseIcon from 'vue-beautiful-chat/src/assets/close-icon.png'
import OpenIcon from 'vue-beautiful-chat/src/assets/logo-no-bg.svg'
import FileIcon from 'vue-beautiful-chat/src/assets/file.svg'
import CloseIconSvg from 'vue-beautiful-chat/src/assets/close.svg'
import logo_blanco from '@/assets/logo_white.svg';
import { CoffeeCloud } from "../coffeecloud";
var _CoffeeCloud = new CoffeeCloud();
import "../coffeecloud.css";
var context = null;
var moment = require('moment-timezone');
export default {
  name: 'Comunicaciones',
  components: {
    
  },
  data: () => ({
    overlay: false,
    status: 'Enviando mensaje',
    logo_white: logo_blanco,
    ahora: moment().format('YYYY-MM-DD HH:mm'),
    placeholder:'Escriba su consulta...',
    icons:{
        open:{
          img: OpenIcon,
          name: 'default',
        },
        close:{
          img: CloseIcon,
          name: 'default',
        },
        file:{
          img: FileIcon,
          name: 'default',
        },
        closeSvg:{
          img: CloseIconSvg,
          name: 'default',
        },
      },
      participants: [
        {
          id: 'caficultor',
          name: 'Ud',
          imageUrl: ''
        },
        {
          id: 'soporte',
          name: 'soporte',
          imageUrl: ''
        }
      ],
      titleImageUrl:'',
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#008869',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true
  }),
  methods: {
    sendMessage (text) {
      console.log(text);
      if (text.length > 0) {
        this.overlay = true;
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({
            author: 'support',
            type: 'text',
            id: 1, // or text '1'
            isEdited: false,
            data: {
              text: text,
            }
          })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      console.log(message);
      _CoffeeCloud.sendMessage(message.data.text,moment().format('YYYY-MM-DD HH:mm'));
      //message.data.meta = moment().format('YYYY-MM-DD HH:mm');
      //this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      //console.log('Emit typing event')
    },
    editMessage(message){
      const m = this.messageList.find(m=>m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  },
  mounted(){
    /*  */
    _CoffeeCloud.container = this;
    context = this;
    _CoffeeCloud.getMensajes();
    setInterval(function(){_CoffeeCloud.getMensajes()},1000 * 30);
  }
};
</script>