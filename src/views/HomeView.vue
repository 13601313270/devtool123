<template>
  <div class="home">
    <div class="head">
      <h1>&lt;/&gt;&nbsp;&nbsp;开发工具合集</h1>
      <div class="userIcon" v-if="userInfo?.user_metadata.full_name">
        <img v-if="avatarUrl" :src="avatarUrl" alt="" @click="userHover = true" />
        <img v-else src="../assets/user.svg" alt="" @click="userHover = true" />
        <div class="hoverPanelOuter" v-if="userInfo?.user_metadata.full_name">
          <div class="hoverPanel" v-show="userHover">
            <div class="close" @click="userHover = false">
              <img src="@/assets/close.svg" alt="" />
            </div>
            <img v-if="avatarUrl" :src="avatarUrl" alt="" />
            <img v-else src="../assets/user.svg" alt="" />
            <div class="userName">{{ userInfo?.user_metadata.full_name }}</div>
            <div style="flex-grow: 1;"></div>
            <div class="signout" @click="signOut">Sign out</div>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- <div class="loginButton" @click="signInWithGoogle('google')">
          <img src="../assets/google.svg" alt="">
          <span>Log in</span>
        </div>
        <div class="loginButton" @click="signInWithGoogle('github')">
          <img src="../assets/google.svg" alt="">
          <span>github</span>
        </div> -->
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-item" v-for="item in tools" :key="item.id"
        :style="{ gridColumn: 'span ' + item.width, gridRow: 'span ' + item.height }" @click="activeTool = item">
        <div class="tool-content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="dialog" v-if="activeTool">
    <div class="title">
      {{ activeTool.name }}
      <div class="close" @click="activeTool = null">
        <img src="@/assets/close.svg" alt="" />
      </div>
    </div>
    <iframe v-if="activeTool.id === 1" src="./tools/json/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 2" src="./tools/md5/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 3" src="./tools/zipImg/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 4" src="./tools/unix/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 5" src="./tools/base64/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 6" src="./tools/getColor/index.html" frameborder="0" />
    <iframe v-else-if="activeTool.id === 7" src="./tools/QRCode/index.html" frameborder="0" />
    <div v-else>{{ activeTool }}</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { createClient } from '@supabase/supabase-js';
import Loading from '@/plugins/loading';

const supabase = createClient(
  'https://tizydzbnoppusddwxnay.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpenlkemJub3BwdXNkZHd4bmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NTYwMDYsImV4cCI6MjA3NTAzMjAwNn0.HwizQk9VyYK_8VB0zdCTe4R87dj1ALZmZPID90EJGh8'
)

interface Tool {
  id: number;
  name: string;
  description: string;
  width: number;
  height: number;
}

const isInitUser = ref<boolean>(false)
const userInfo = ref<{
  id: string;
  user_metadata: {
    full_name: string;
  }
}>()
const userHover = ref<boolean>(false)
const activeTool = ref<Tool>()

const tools = ref<Tool[]>([
  { id: 1, name: 'JSON格式化', description: '美化和格式化JSON数据', width: 1, height: 1 },
  { id: 2, name: 'MD5', description: '计算字符串的MD5哈希值', width: 1, height: 1 },
  { id: 3, name: '图片压缩', description: '压缩图片文件大小', width: 1, height: 1 },
  { id: 4, name: 'Unix时间戳转换', description: '转换Unix时间戳为日期', width: 1, height: 1 },
  { id: 5, name: 'Base64编码', description: 'Base64编解码工具', width: 1, height: 1 },
  { id: 6, name: '颜色选择器', description: '颜色值转换和选取', width: 1, height: 1 },
  { id: 7, name: '二维码生成', description: '生成二维码图片', width: 1, height: 1 },
  // { id: 1, name: '代码格式化', description: '美化和格式化代码', width: 1, height: 1 },
  // { id: 3, name: '时间转换器', description: '多种时间格式转换', width: 2, height: 1 },
  // { id: 4, name: 'API测试', description: 'HTTP请求测试工具', width: 1, height: 2 },
  // { id: 5, name: '正则表达式', description: '正则表达式测试和验证', width: 1, height: 1 },
  // { id: 8, name: '单位转换', description: '常用单位换算', width: 1, height: 1 },
  // { id: 9, name: '密码生成', description: '安全密码生成器', width: 1, height: 1 },
  // { id: 10, name: 'Markdown编辑器', description: '实时预览Markdown文档', width: 2, height: 1 },
  // { id: 13, name: '文件转换', description: '文件格式转换工具', width: 2, height: 1 },
  // { id: 14, name: 'JSON格式化', description: '美化和格式化JSON数据', width: 2, height: 1 },
  // { id: 15, name: 'XML格式化', description: '美化和格式化XML数据', width: 2, height: 1 },
  // { id: 16, name: 'SQL格式化', description: '美化和格式化SQL语句', width: 2, height: 1 },
  // { id: 17, name: 'CSV工具', description: 'CSV文件解析和转换', width: 2, height: 1 },
  // { id: 18, name: 'Markdown预览', description: '实时预览Markdown文档', width: 2, height: 1 },
  // { id: 19, name: '文件下载', description: '文件下载工具', width: 2, height: 1 },
  // { id: 20, name: '文件上传', description: '文件上传工具', width: 2, height: 1 },
  // { id: 21, name: '文件合并', description: '合并多个文件', width: 2, height: 1 },
  // { id: 22, name: '文件拆分', description: '拆分大文件为多个小文件', width: 2, height: 1 },
  // { id: 23, name: '文件加密', description: '文件加密工具', width: 2, height: 1 },
]);
onMounted(async () => {
  initUnitUserInfo();
})

async function initUnitUserInfo() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    isInitUser.value = true;
    console.error("用户未登录")
    return
  }

  const fetchUser: any = await fetch(
    "https://tizydzbnoppusddwxnay.supabase.co/functions/v1/userInfo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  if (!fetchUser.ok) {
    throw new Error(`HTTP ${fetchUser.status}`);
  }
  const { user } = await fetchUser.json();
  if (!user) {
    isInitUser.value = true;
    console.log('用户未登录')
    return
  }
  console.log('ooooo', user)
  userInfo.value = user as any;
}
async function signInWithGoogle(provider: 'google') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin, // 登录完成后跳转回当前页面
    },
  })
  if (error) {
    console.error('Google 登录失败:', error)
  } else {
    console.log('重定向到 Google 登录页', data)
  }
  Loading({
    message: 'loading...',
  })
}
async function signOut() {
  const loading = Loading({
    message: 'loading...',
  })
  const { error } = await supabase.auth.signOut()
  loading.destory()
  if (error) {
    console.error('退出登录失败:', error)
  } else {
    console.log('退出登录成功')
    // 刷新页面
    window.location.reload();
    isInitUser.value = false;
  }
}
</script>

<style scoped lang="less">
.home {
  padding: 20px;
  box-sizing: border-box;
  min-height: 100vh;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;

  h1 {
    text-align: center;
    margin: 0;
    color: #333;
  }

  .userIcon {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: #E6E6F1;
    box-shadow: 0 0 1px #a1a1a7;
    position: relative;

    // &:hover {

    //   .hoverPanel {
    //     display: flex !important;
    //   }
    // }

    >img {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      margin-right: 8px;
      cursor: pointer;
    }

    .hoverPanelOuter {
      background-color: transparent;
      position: absolute;
      right: 0;
      top: 26px;
      z-index: 1;

      .hoverPanel {
        margin-top: 26px;
        width: 338px;
        height: 355px;
        border-radius: 24px;
        background-color: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 241, 1);
        // display: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 17px 0 22px;

        .close {
          position: absolute;
          top: 40px;
          right: 20px;
          font-size: 24px;
          color: rgba(16, 16, 16, 1);
          cursor: pointer;
          z-index: 10001;

          >img {
            width: 25px;
            height: 25px;
          }
        }

        >img {
          width: 48px;
          height: 48px;
          border-radius: 24px;
        }

        .userName {
          margin-top: 10px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .paintedPixels {
          margin-top: 30px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .userLevel {
          margin-top: 18px;
          height: 20px;
          line-height: 20px;
          color: rgba(3, 61, 93, 1);
          font-size: 18px;
          font-family: PingFangSC-regular;
        }

        .signout {
          width: 201px;
          height: 33px;
          line-height: 20px;
          border-radius: 13px;
          background-color: rgba(255, 255, 255, 1);
          color: rgba(16, 16, 16, 1);
          font-size: 14px;
          text-align: center;
          font-family: PingFangSC-regular;
          border: 1px solid rgba(187, 187, 187, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }

  .loginButton {
    width: 96px;
    height: 32px;
    line-height: 20px;
    border-radius: 12px;
    background-color: rgba(52, 135, 255, 1);
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    text-align: center;
    font-family: PingFangSC-regular;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    >img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(150px, auto);
  gap: 20px;
  margin-top: 20px;
}

.grid-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: solid 1px #e6e6e6;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.tool-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.tool-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.tool-content p {
  margin: 0;
  color: #666;
  font-size: 0.9em;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 24px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .title {
    flex-shrink: 0;
    height: 48px;
    line-height: 48px;
    color: rgba(3, 61, 93, 1);
    font-size: 24px;
    font-family: PingFangSC-regular;
    text-align: center;

    .close {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001;

      >img {
        width: 25px;
        height: 25px;
      }
    }
  }

  >iframe {
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
}
</style>
