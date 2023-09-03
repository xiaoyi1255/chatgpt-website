<script setup lang="ts">
/* eslint-disable */
import qr_code from "@/assets/qrcode.jpg";
import { NButton, NInput, useMessage, NModal, NImage } from "naive-ui";
import { SvgIcon } from "@/components/common";
import { debounce } from '@/utils/functions/debounce'

import { useAuthStore } from "@/store";
import { fetchVerifyCode } from "@/api";
import { ref, computed } from "vue";
interface Emit {
  (e: "update:visible", visible: boolean): void;
}
interface Props {
  visible: boolean
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();
const ms = useMessage();
const authStore = useAuthStore();
const showModal = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit("update:visible", visible),
});
const codeValue = ref("");

const handleSendCode = debounce(async function() {
  const reg = /^[0-9]{6}$/;
  if (!reg.test(codeValue.value)) {
    ms.error("请输入6位纯数字验证码");
    return;
  }
  try {
    const res = await fetchVerifyCode(codeValue.value) as any;
    const { token = "" } = res.data || {};
    if (token) {
      authStore.setWechatToken(token);
      emit("update:visible", false)
      ms.success("登录成功！！");
    }
  } catch (error: any) {
    ms.error(error?.msg);
    authStore.removeWechatToken();
  }
}, 600)
/* eslint-enable */

</script>

<template>
  <NModal
    v-model:show="showModal"
    style="width: 90%; max-width: 500px;padding: 2vh; 0"
    preset="card"
  >
    <div style="display: flex; align-items: center; flex-direction: column">
      <div class="title">关注公众号后：发送 <span>登录</span> 获取验证码</div>
      <NImage width="300" :src="qr_code" preview-disabled />
      <div style="display: flex; align-items: center">
        <NInput
          autofocus
          clearable
          show-count
          v-model:value="codeValue"
          style="width: 70%"
          placeholder="请输入验证码"
          :maxlength="6"
        />
        <NButton type="primary" :disabled="!codeValue" @click="handleSendCode">
          <template #icon>
            <span class="dark:text-black">
              <SvgIcon icon="ri:send-plane-fill" />
            </span>
          </template>
          提交
        </NButton>
      </div>
    </div>
  </NModal>
</template>


<style lang='less' scoped>
.title {
  font-size: 14px;
  span {
    color: blue;
    font-weight: 700;
  }
}
</style>
