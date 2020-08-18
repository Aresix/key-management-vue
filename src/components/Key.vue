<template>
  <div class="note">
    <h2 style="margin-top: -10px">AES在线加密、解密
      <el-tooltip class="item" effect="dark" placement="bottom">
        <div slot="content" style="font-size: 16px">
          该页面提供两种用法：<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;方法一：<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 根据页面提示，先在左上角的输入框中输入想要加密的文本。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 点击“加密”，加密后的文本将在右侧对话框中显示。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 点击“发送”，加密后的文本将发送至后端，后端会返回一段新的文字，呈现在左下角的对话框中。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. 发送前请务必先加密，否则后端将无法解密。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;方法二：<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 先在左上角的输入框中输入想要加密的文本。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 点击“加密”，加密后的文本将在右侧对话框中显示。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 复制右上角对话框中显示的加密文本，粘贴至左下角的对话框中。点击解密，可在右侧对话框中得原文。<br/>
        </div>
<!--        <el-button type="plain" circle icon="el-icon-info"/>-->
        <i class="el-icon-info"/>
      </el-tooltip>
    </h2>
    <el-row style="width: 100%; margin-top: 5px">
      <div class="tableTitle"><span class="midText" v-text="'>>> Step 1. 输入文字，点击加密，再发送 <<<'"/></div>
    </el-row>
    <el-row justify="center" >
      <el-col :span="9">
        <el-form class="card" ref="origin" :model="origin" label-width="80px">
          <el-form-item label="明文">
            <el-input type="textarea" placeholder="请输入需要加密的文字" resize="none" :autosize="{minRows: 5, maxRows: 5}" v-model="origin.context"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain icon="el-icon-lock" @click="onSubmit">加密</el-button>
            <el-button type="success" plain icon="el-icon-position" @click="onSend">发送</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="onClear(origin)">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <img class="instruction" src="../assets/right-arrow.png">
      </el-col>
      <el-col :span="9">
        <el-form class="card" ref="ciphered" :model="ciphered" label-width="80px">
          <el-form-item label="密文">
            <el-input type="textarea" readonly :autosize="{minRows: 5, maxRows: 5}" resize="none" v-model="ciphered.context"/>
          </el-form-item>
          <el-form-item>
<!--            <el-button type="primary" @click="onSubmit">发送</el-button>-->
            <el-button type="danger" plain icon="el-icon-delete" @click="onClear(ciphered)">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="width: 100%">
      <div class="tableTitle"><span class="midText" v-text="'>>> Step 2. 后端反馈，再进行解密吧！ <<<'"/></div>
    </el-row>
    <el-row justify="center" >
      <el-col :span="9">
        <el-form class="card" ref="decipher" :model="decipher" label-width="80px">
          <el-form-item label="密文">
            <el-input type="textarea" placeholder="请输入需要解密的文字" resize="none" :autosize="{minRows: 5, maxRows: 5}" v-model="decipher.context"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain icon="el-icon-unlock" @click="onDecipher">解密</el-button>
            <el-button type="danger" plain icon="el-icon-delete" @click="onClear(decipher)">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <img class="instruction" src="../assets/right-arrow.png">
      </el-col>
      <el-col :span="9">
        <el-form class="card" ref="de_res" :model="de_res" label-width="80px">
          <el-form-item label="明文">
            <el-input type="textarea" readonly :autosize="{minRows: 5, maxRows: 5}" resize="none" v-model="de_res.context"/>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" plain icon="el-icon-delete" @click="onClear(de_res)">清空</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <p class="copyright">©Made by Aresix</p>
  </div>
</template>

<script>
import cipher from '../utils/cipher'

export default {
  name: 'Key',
  data () {
    return {
      origin: {
        context: ''
      },
      ciphered: {
        context: ''
      },
      decipher: {
        context: ''
      },
      de_res: {
        context: ''
      },
      responseResult: []
    }
  },
  methods: {
    onSubmit () {
      console.log('待加密文字' + this.origin.context)
      var cipheredContext = cipher.Encrypt(this.origin.context)
      this.ciphered.context = cipheredContext
      this.$axios
        .post('/cipher', {
          context: cipheredContext
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.data = successResponse.data
            console.log('提交成功')
            // console.log(this.data)
            // this.ciphered.context = this.data.toString()
          }
        })
        .catch(failResponse => {
        })
    },
    onSend () {
      var _this = this
      this.$axios
        .get('/decipher')// + this.ciphered.context)
        .then(resp => {
          if (resp && resp.status === 200) {
            _this.decipher.context = resp.data
            console.log(resp.data)
          }
        })
        .catch(function (response) {
          console.log(response)
        })
    },
    onClear (inputItem) {
      inputItem.context = ''
    },
    onDecipher () {
      var decipherStr = this.decipher.context
      console.log(decipherStr)
      this.de_res.context = cipher.Decrypt(decipherStr)
      console.log(cipher.Decrypt(decipherStr))
    }
  }
}
</script>

<style scoped>
  .item {
    margin: 4px;
    font-size: 20px;
  }
  .note{
    padding-left: 20px;
    padding-right: 20px;
    background: url("../assets/background.png") no-repeat;
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
    position: fixed;
  }
  .card {
    margin: 10px;
    border-radius: 10px;
    /*background: #42b983;*/
    width: 500px;
    height: 200px;
    /*background-color: rgba(255, 255, 255, 0.6);*/
    background-color: rgba(255, 255, 255, 0.24);
    padding: 30px;
    /*border-radius: 20px;*/
    border: 1px solid #eaeaea;
    box-shadow: 0 0 16px #cac6c6;
  }
  .tableTitle {
    position: relative;
    margin: 5px;
    width: inherit;
    height: 0.5px;
    background-color: rgba(147, 112, 219, 0.22);
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }
  .midText {
    position: absolute;
    left: 50%;
    width: auto;
    border-radius: 5px;
    background-color: rgba(255, 153, 194, 0.32);
    padding: 0 15px;
    transform: translateX(-50%) translateY(-50%);
  }
  .instruction {
    align-items: center;
    margin-top: 60px;
    animation:Updown 1s infinite alternate;
    -webkit-animation:Updown 1s alternate infinite
  }
  @keyframes Updown{
    from{margin-left:35px;}
    to{margin-right:0px;}
  }
  @-webkit-keyframes Updown{
    from{margin-left:35px;}
    to{margin-right:0px;}
  }
  .copyright {
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: #9443c8
  }
</style>
