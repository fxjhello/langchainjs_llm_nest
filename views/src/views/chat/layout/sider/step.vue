<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import type { FormInst } from 'naive-ui'
import { NButton, NForm, NFormItem, NInput, NPopover, NScrollbar, NSelect, NSwitch } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useChatStore } from '@/store'
import { modelsStore } from '@/store/modules/models/models-setting'
import { setembedding } from '@/api/chat'
const store = modelsStore()
const formRef = ref<FormInst | null>(null)
const chatStore = useChatStore()
const dataSources = ref<any[]>([])
// const set = ref<boolean>(false)
const disabled = ref<boolean>(false)
const disabledgpt = ref<boolean>(false)
const showPopover = ref<boolean>(false)
const value = ref<any>()
const options = ref<any[]>([])
const formValue = ref({
  user: {
    name: '',
    age: '',
  },
  phone: '',
})
onMounted(async () => {
  dataSources.value = ['用户输入', '知识库', 'Chatglm6b', 'Chatgpt']
  options.value = [
    {
      label: '本地',
      value: 'default',
    },
    {
      label: 'Cohere',
      value: 'cohere',
    },
    {
      label: 'Openai',
      value: 'openai',
    }]
})
watch(
  () => value.value,
  (val) => {
    if (val === 'cohere') {
      formValue.value.user.name = store.Coherekey
      formValue.value.user.age = store.Coherepath
    }
    if (val === 'openai') {
      formValue.value.user.name = store.Openaikey
      formValue.value.user.age = store.Openaipath
    }
  },
  { immediate: true },
)
const handleset = (index: number) => {
  showPopover.value = true
  if (index === 1) {
    value.value = store.embedding
    if (value.value === 'cohere') {
      formValue.value.user.name = store.Coherekey
      formValue.value.user.age = store.Coherepath
    }
    if (value.value === 'openai') {
      formValue.value.user.name = store.Openaikey
      formValue.value.user.age = store.Openaipath
    }
  }

  if (index === 2)
    disabled.value = store.chatglm
  if (index === 3) {
    disabledgpt.value = store.Chatgpt
    formValue.value.user.name = store.Openaikey
    formValue.value.user.age = store.Openaipath
  }
}
const handleValidateClick = async (index: any) => {
  showPopover.value = false
  if (index === 1) {
    store.embedding = value.value

    if (value.value === 'cohere') {
      store.Coherekey = formValue.value.user.name
      store.Coherepath = formValue.value.user.age
    }
    if (value.value === 'openai') {
      store.Openaikey = formValue.value.user.name
      store.Openaipath = formValue.value.user.age
    }
    await setembedding({ name: value.value, api_key: formValue.value.user.name, basePath: formValue.value.user.age })
  }
  if (index === 2)
    store.chatglm = disabled.value
  if (index === 3) {
    store.Openaikey = formValue.value.user.name
    store.Openaipath = formValue.value.user.age
    store.Chatgpt = disabledgpt.value
  }
}
/* function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(uuid, { isEdit })
} */

/* async function handleDelete(item: any) {
  await deletefile({ fileName: item })
  const res = await getfilelist()
  dataSources.value = res.data
} */

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter')
    chatStore.updateHistory(uuid, { isEdit })
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
          >
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.title" size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item }}</span>
            </div>
            <div class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
              <!-- <button class="p-1" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button> -->
              </template>
              <template v-else>
                <!--  <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button> -->
                <!-- <NPopconfirm placement="bottom"> -->

                <!--  <template #trigger> -->
                <NPopover trigger="click" placement="right-start">
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:settings-2-line" @click="handleset(index)" />
                    </button>
                  </template>
                  <!-- 知识库 -->
                  <NForm
                    v-if="index === 1 && showPopover"
                    ref="formRef"
                    inline
                    :label-width="80"
                    :model="formValue"
                  >
                    <!-- <NFormItem label=""><n-select v-model:value="value" :options="options" /></NFormItem> -->
                    <NFormItem label="请选择Embedding">
                      <NSelect v-model:value="value" :options="options" />
                    </NFormItem>
                    <NFormItem v-if="value !== 'default'" label="apiKey">
                      <NInput v-model:value="formValue.user.name" placeholder="输入apikey" />
                    </NFormItem>
                    <NFormItem v-if="value !== 'default'" label="代理(可不填)">
                      <NInput v-model:value="formValue.user.age" placeholder="输入代理地址" />
                    </NFormItem>
                    <NFormItem>
                      <NButton
                        round
                        type="primary"
                        @click="handleValidateClick(index)"
                      >
                        保存
                      </NButton>
                    </NFormItem>
                  </NForm>
                  <!-- glm6b -->
                  <NForm
                    v-if="index === 2 && showPopover"
                    ref="formRef"
                    inline
                    :label-width="80"
                    :model="formValue"
                  >
                    <!-- <NFormItem label=""><n-select v-model:value="value" :options="options" /></NFormItem> -->
                    <NFormItem label="是否启用">
                      <NSwitch v-model:value="disabled" />
                    </NFormItem>
                    <NFormItem>
                      <NButton
                        round
                        type="primary"
                        @click="handleValidateClick(index)"
                      >
                        保存
                      </NButton>
                    </NFormItem>
                  </NForm>
                  <!-- Chatgpt -->
                  <NForm
                    v-if="index === 3 && showPopover"
                    ref="formRef"
                    inline
                    :label-width="80"
                    :model="formValue"
                  >
                    <!-- <NFormItem label=""><n-select v-model:value="value" :options="options" /></NFormItem> -->
                    <NFormItem label="OpenaiKey">
                      <NInput v-model:value="formValue.user.name" placeholder="输入apikey" />
                    </NFormItem>
                    <NFormItem label="代理(可不填)">
                      <NInput v-model:value="formValue.user.age" placeholder="输入代理地址" />
                    </NFormItem>
                    <NFormItem label="是否启用">
                      <NSwitch v-model:value="disabledgpt" />
                    </NFormItem>
                    <NFormItem>
                      <NButton
                        round
                        type="primary"
                        @click="handleValidateClick(index)"
                      >
                        保存
                      </NButton>
                    </NFormItem>
                  </NForm>
                </NPopover>

              <!-- </template> -->
              <!--  <template #default>
                    <SvgIcon icon="ri:settings-2-line" @click="handleset(index)" />
                  </template> -->

              <!-- </NPopconfirm> -->
              </template>
            </div>
          </a>
          <div v-if="[0, 1].includes(index)">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓
          </div>
          <div v-if="index === 2">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+
          </div>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>
