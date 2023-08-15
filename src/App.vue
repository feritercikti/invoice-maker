<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { jsPDF } from 'jspdf'

type CurrencySymbols = {
  [key: string]: string
}

const time0 = ref<Date | null>(new Date())

const time1 = ref<Date | null>(new Date())

const selectedCurrency = ref('USD')
const showDropdown = ref(false)

const currencySymbols: CurrencySymbols = {
  AED: 'د.إ', // United Arab Emirates Dirham
  ARS: '$', // Argentine Peso
  AUD: '$', // Australian Dollar
  BRL: 'R$', // Brazilian Real
  CAD: '$', // Canadian Dollar
  CHF: 'Fr.', // Swiss Franc
  CNY: '¥', // Chinese Yuan
  CZK: 'Kč', // Czech Koruna
  DKK: 'kr.', // Danish Krone
  EUR: '€', // Euro
  GBP: '£', // British Pound
  HKD: '$', // Hong Kong Dollar
  HUF: 'Ft', // Hungarian Forint
  IDR: 'Rp', // Indonesian Rupiah
  ILS: '₪', // Israeli New Shekel
  INR: '₹', // Indian Rupee
  JPY: '¥', // Japanese Yen
  KRW: '₩', // South Korean Won
  MXN: '$', // Mexican Peso
  MYR: 'RM', // Malaysian Ringgit
  NOK: 'kr', // Norwegian Krone
  NZD: '$', // New Zealand Dollar
  PHP: '₱', // Philippine Peso
  PLN: 'zł', // Polish Złoty
  RON: 'lei', // Romanian Leu
  RUB: '₽', // Russian Ruble
  SEK: 'kr', // Swedish Krona
  SGD: '$', // Singapore Dollar
  THB: '฿', // Thai Baht
  TRY: '₺', // Turkish Lira
  USD: '$', // United States Dollar
  ZAR: 'R' // South African Rand
}

const currencyOptionText = (currency: string) => {
  return `${currencySymbols[currency]} ${currency}`
}

const currencies = Object.keys(currencySymbols)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const hideDropdown = () => {
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})

const handleDocumentClick = (event: any) => {
  if (!event.target.closest('.dropdown-container')) {
    showDropdown.value = false
  }
}

let showDeleteButton = ref(-1)
const pdfRef = ref<null | HTMLElement>(null)
const taxRate = ref(15)
const logoUrl = ref<string | null>(null)
let fileInput: HTMLInputElement | null = null

onMounted(() => {
  fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.addEventListener('change', handleLogoChange)
})

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    logoUrl.value = URL.createObjectURL(file)
    fileInput!.style.display = 'none'
  } else {
    logoUrl.value = null
  }
}

const openFileInput = () => {
  if (fileInput) {
    fileInput.click()
  }
}

const calculateSubtotal = () => {
  let subtotal = 0
  lineItems.value.forEach((item) => {
    subtotal += parseFloat(calculateAmount(item.quantity, item.rate))
  })
  return subtotal
}

const calculatedSaleTax = computed(() => {
  return calculateSubtotal() * (taxRate.value / 100)
})

const calculatedTotal = computed(() => {
  return calculateSubtotal() + calculatedSaleTax.value
})

const lineItems = ref([{ description: '', quantity: '1', rate: '0.00', amount: '0.00' }])

function addLineItem() {
  lineItems.value.push({ description: '', quantity: '1', rate: '0.00', amount: '0.00' })
}

const deleteItem = (index: number) => {
  lineItems.value.splice(index, 1)
}

// function updateDescription(index: number, value: string) {
//   lineItems.value[index].description = value
// }

// function updateQuantity(index: number, value: string) {
//   lineItems.value[index].quantity = value
// }

// function updateRate(index: number, value: string) {
//   lineItems.value[index].rate = value
// }

function calculateAmount(quantity: string, rate: string): string {
  const parsedQuantity = parseFloat(quantity)
  const parsedRate = parseFloat(rate)

  if (isNaN(parsedQuantity) || isNaN(parsedRate)) {
    return 'Invalid'
  }

  const amount: number = parsedQuantity * parsedRate
  return amount.toFixed(2)
}

const generatePDF = async () => {
  if (!pdfRef.value) return

  const pdfContentHeight = pdfRef.value.offsetHeight

  const doc = new jsPDF('p', 'px', [700, pdfContentHeight + 10])

  const addButton = pdfRef.value.querySelector('.exclude-from-pdf')
  const logoSection = pdfRef.value.querySelector('.excludelogo-from-pdf')
  if (addButton) {
    ;(addButton as HTMLElement).style.display = 'none'
  }
  if (logoSection) {
    ;(logoSection as HTMLElement).style.display = 'none'
  }

  await doc.html(pdfRef.value, {
    callback(doc) {
      doc.deletePage(2)

      doc.save('invoice.pdf')
      if (addButton) {
        ;(addButton as HTMLElement).style.display = 'flex'
      }
      if (logoSection) {
        ;(logoSection as HTMLElement).style.display = 'block'
      }
    }
  })
}
</script>

<template>
  <div class="w-full flex justify-end">
    <a href="https://github.com/feritercikti/invoice-maker" target="_blank">
      <font-awesome-icon
        :icon="['fab', 'github']"
        size="2xl"
        class="mt-2 mx-10 cursor-pointer hover:text-gray-500"
      />
    </a>
  </div>
  <div class="flex items-center justify-center">
    <div>
      <button @click="generatePDF" class="px-2 py-1 text-white bg-emerald-600 hover:bg-emerald-900">
        Save as PDF
      </button>
    </div>
    <div class="flex items-center flex-col w-[50%] gap-5 my-10">
      <h1 class="text-2xl text-center">
        Online Invoicing Software Tool - Create, Generate and Download Invoices or Invoice Templates
        as PDF
      </h1>

      <div class="flex flex-col bg-white w-[700px] h-fit shadow-xl" ref="pdfRef">
        <div class="flex gap-2 w-fit m-10">
          <div class="flex-1 flex flex-col">
            <label class="custom-file-input excludelogo-from-pdf" v-if="!logoUrl">
              Your Logo
              <input type="file" accept="image/*" @change="handleLogoChange" class="hidden" />
            </label>
            <div
              v-if="logoUrl"
              class="image-container cursor-pointer relative"
              @click="openFileInput"
            >
              <img :src="logoUrl" alt="Company Logo" class="h-20" />
              <div class="change-image-text">Change Image</div>
            </div>
            <input
              placeholder="Your Company"
              class="hover:bg-amber-100 text-[18px] focus:bg-amber-100 h-10 font-bold outline-none"
            />
            <input
              placeholder="Your Name"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="Company's Address"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="City,State Zip"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="Country"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
          </div>
          <div class="flex-1">
            <input
              value="INVOICE"
              class="hover:bg-amber-100 font-bold text-gray-900 text-[24px] w-full text-right focus:bg-amber-100 px-2 h-10 outline-none"
            />
          </div>
        </div>
        <div class="flex gap-2 w-full mx-10">
          <div class="flex-1 flex flex-col">
            <div class="flex gap-1">
              <input
                value="Bill To:"
                class="hover:bg-amber-100 text-[14px] mb-5 w-full focus:bg-amber-100 h-8 font-bold outline-none"
              />
            </div>
            <input
              placeholder="Your Client's Name"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="Client's Address"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="City,State Zip"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
            <input
              placeholder="Country"
              class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 h-8 outline-none"
            />
          </div>
          <div class="flex flex-1 gap-2">
            <div class="flex-1 flex-col">
              <input
                value="Invoice#"
                class="hover:bg-amber-100 text-[14px] w-[120px] focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Invoice Date"
                class="hover:bg-amber-100 text-[14px] w-[120px] focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Due Date"
                class="hover:bg-amber-100 text-[14px] w-[120px] focus:bg-amber-100 font-bold h-8 outline-none"
              />
            </div>
            <div class="flex-2 flex-col">
              <input
                placeholder="INV-12"
                class="hover:bg-amber-100 text-[14px] w-[135px] focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] w-[135px] focus:bg-amber-100 h-8 outline-none"
                v-model="time0"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] w-[135px] focus:bg-amber-100 h-8 outline-none"
                v-model="time1"
              />
            </div>
          </div>
        </div>
        <div class="mx-10 my-10 mt-5">
          <table class="border-collapse">
            <thead>
              <tr class="bg-gray-600 text-white text-left">
                <th class="py-2 px-4">
                  <input
                    value="Item Description"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none"
                  />
                </th>
                <th class="py-2 px-4">
                  <input
                    value="Quantity"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                  />
                </th>
                <th class="py-2 px-4">
                  <input
                    value="Rate"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                  />
                </th>
                <th class="py-2 px-4">
                  <input
                    value="Amount"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                  />
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-100 divide-y divide-gray-300">
              <tr
                v-for="(item, index) in lineItems"
                :key="index"
                class="bg-white relative"
                @mouseenter="showDeleteButton = index"
                @mouseleave="showDeleteButton = -1"
              >
                <td class="py-2 px-2">
                  <textarea
                    placeholder="Enter item name/description"
                    class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100"
                    rows="2"
                    cols="30"
                    v-model="item.description"
                  ></textarea>
                </td>
                <td class="py-2 px-4">
                  <input
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                    v-model="item.quantity"
                  />
                </td>
                <td class="py-2 px-4">
                  <input
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                    v-model="item.rate"
                  />
                </td>
                <td class="py-2 font-bold px-4 text-right text-[14px]">
                  {{ calculateAmount(item.quantity, item.rate) }}
                </td>
                <td class="py-2 text-right" v-if="showDeleteButton === index">
                  <button
                    class="text-sm inline-block py-[2px] px-1 bg-red-700 text-white"
                    @click="deleteItem(index)"
                  >
                    X
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            class="w-fit flex gap-4 items-center text-center mt-5 exclude-from-pdf"
            @click="addLineItem"
          >
            <div class="px-2 py-1 bg-green-700 text-white text-xl">+</div>
            <p>Add Line Item</p>
          </button>
        </div>
        <div class="flex max-w-full justify-end mx-10">
          <div class="flex gap-8 items-center w-fit text-[14px]">
            <input
              value="Sub Total"
              class="text-right hover:bg-amber-100 rounded-sm hover:text-black bg-transparent focus:bg-amber-100 focus:text-black font-bold outline-none w-[120px]"
            />
            <div class="inline-block align-middle ml-6">{{ calculateSubtotal().toFixed(2) }}</div>
          </div>
        </div>
        <div class="flex max-w-full justify-end mx-10">
          <div class="flex items-center gap-1 w-fit text-[14px]">
            <input
              value="Tax"
              class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent focus:bg-amber-100 focus:text-black font-bold outline-none w-fit text-right"
            />
            <input
              v-model="taxRate"
              class="text-right hover:bg-amber-100 rounded-sm hover:text-black bg-transparent focus:bg-amber-100 focus:text-black font-bold outline-none w-6"
            />
            <p class="mr-8 font-bold">%</p>
            <div class="ml-5">{{ calculatedSaleTax.toFixed(2) }}</div>
          </div>
        </div>

        <div class="flex max-w-full justify-end mx-10 mb-5 mt-2">
          <div class="flex gap-8 items-center w-fit text-[14px]">
            <h1>TOTAL</h1>

            <div v-if="!selectedCurrency">
              <select v-model="selectedCurrency">
                <option v-for="currency in currencies" :value="currency" :key="currency">
                  {{ currencyOptionText(currency) }}
                </option>
              </select>
            </div>
            <div v-else class="flex gap-2 dropdown-container">
              <span
                @click="toggleDropdown"
                class="cursor-pointer px-2 hover:bg-amber-100 hover:border-2 hover:border-black"
                >{{ currencySymbols[selectedCurrency] }}</span
              >
              <div v-if="showDropdown">
                <select v-model="selectedCurrency" @change="hideDropdown" @blur="hideDropdown">
                  <option v-for="currency in currencies" :value="currency" :key="currency">
                    {{ currencyOptionText(currency) }}
                  </option>
                </select>
              </div>
              {{ calculatedTotal.toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="flex flex-col max-w-full mx-10 mb-1">
          <input
            value="Notes"
            class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-full"
          />
          <textarea class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100" rows="2">
It was great doing business with you.</textarea
          >
        </div>
        <div class="flex flex-col max-w-full mx-10 mb-10">
          <input
            value="Terms & Conditions"
            class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-full"
          />
          <textarea class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100" rows="2">
Please make the payment by the due date.</textarea
          >
        </div>
      </div>
    </div>
  </div>
</template>
