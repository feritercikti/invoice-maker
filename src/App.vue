<script setup lang="ts">
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'

const time0 = ref<Date | null>(new Date())

const oneMonthFromNow = new Date()
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)
const time1 = ref<Date | null>(oneMonthFromNow)

const showDeleteButton = ref<boolean>(false)
const pdfRef = ref<null | HTMLElement>(null)
const taxRate = ref(0.14) // Example tax rate

const calculateSubtotal = () => {
  let subtotal = 0
  lineItems.value.forEach((item) => {
    subtotal += parseFloat(calculateAmount(item.quantity, item.rate))
  })
  return subtotal
}

const calculatedSaleTax = computed(() => {
  return calculateSubtotal() * taxRate.value
})

const calculatedTotal = computed(() => {
  return calculateSubtotal() + calculatedSaleTax.value
})

const updateTaxRate = (event: any) => {
  const inputValue = parseFloat(event.target.value)
  if (!isNaN(inputValue)) {
    taxRate.value = inputValue / 100
  }
}

const lineItems = ref([{ description: '', quantity: '1', rate: '0.00', amount: '0.00' }])

function addLineItem() {
  lineItems.value.push({ description: '', quantity: '1', rate: '0.00', amount: '0.00' })
}

function updateDescription(index: number, value: string) {
  lineItems.value[index].description = value
}

function updateQuantity(index: number, value: string) {
  lineItems.value[index].quantity = value
}

function updateRate(index: number, value: string) {
  lineItems.value[index].rate = value
}

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

  const doc = new jsPDF('p', 'px', [700, 900])

  const addButton = pdfRef.value.querySelector('.exclude-from-pdf')
  if (addButton) {
    ;(addButton as HTMLElement).style.display = 'none' // Cast to HTMLElement
  }

  await doc.html(pdfRef.value, {
    callback(doc) {
      doc.deletePage(2)

      doc.save('document.pdf')
      if (addButton) {
        ;(addButton as HTMLElement).style.display = 'block' // Cast to HTMLElement
      }
    }
  })
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div></div>
    <div class="flex items-center flex-col w-[50%] gap-5 my-10">
      <h1 class="text-2xl text-center">
        Online Invoicing Software Tool - Create, Generate and Download Invoices or Invoice Templates
        as PDF
      </h1>
      <button @click="generatePDF" class="px-2 py-1 text-white bg-emerald-700">
        Click to generate
      </button>
      <div class="flex flex-col bg-white w-[700px] h-fit shadow-xl" ref="pdfRef">
        <div class="flex gap-2 w-fit m-10">
          <div class="flex-1 flex flex-col">
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
          </div>
          <div class="flex-1 w-fit">
            <input
              value="INVOICE"
              class="hover:bg-amber-100 text-[36px] w-full text-right focus:bg-amber-100 px-2 h-14 outline-none"
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
          </div>
          <div class="flex flex-1 gap-2">
            <div class="flex-1 flex-col">
              <input
                value="Invoice#"
                class="hover:bg-amber-100 text-[14px] w-[120px] mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Invoice Date"
                class="hover:bg-amber-100 text-[14px] mb-5 w-[120px] focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Due Date"
                class="hover:bg-amber-100 text-[14px] w-[120px] focus:bg-amber-100 font-bold h-8 outline-none"
              />
            </div>
            <div class="flex-2 flex-col">
              <input
                placeholder="INV-12"
                class="hover:bg-amber-100 text-[14px] w-[135px] mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] w-[135px] mb-5 focus:bg-amber-100 h-8 outline-none"
                v-model="time0"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] w-[135px] mb-5 focus:bg-amber-100 h-8 outline-none"
                v-model="time1"
              />
            </div>
          </div>
        </div>
        <div class="mx-10 my-10 mt-5">
          <table class="border-collapse">
            <thead>
              <tr class="bg-green-600 text-white text-left">
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
                class="bg-white hover:bg-gray-200 relative"
              >
                <td class="py-2 px-2">
                  <textarea
                    placeholder="Enter item name/description"
                    class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100"
                    rows="2"
                    cols="30"
                    v-model="item.description"
                    @input="updateDescription(index, item.description)"
                  ></textarea>
                </td>
                <td class="py-2 px-4">
                  <input
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                    v-model="item.quantity"
                    @input="updateQuantity(index, item.quantity)"
                  />
                </td>
                <td class="py-2 px-4">
                  <input
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px] text-right"
                    v-model="item.rate"
                    @input="updateRate(index, item.rate)"
                  />
                </td>
                <td class="py-2 font-bold px-4 text-right text-[14px]">
                  {{ calculateAmount(item.quantity, item.rate) }}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            class="w-fit flex gap-4 items-center text-center mt-5 exclude-from-pdf"
            @click="addLineItem"
          >
            <div class="px-2 py-[2px] rounded-[50%] bg-green-400 text-white text-xl">+</div>
            <p>Add Line Item</p>
          </button>
        </div>
        <div class="flex max-w-full justify-end mx-10">
          <div class="flex gap-10 items-center w-fit text-[14px]">
            <input
              value="Sub Total"
              class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent focus:bg-amber-100 focus:text-black h-7 font-bold outline-none w-[120px]"
            />
            <div class="inline-block align-middle">{{ calculateSubtotal().toFixed(2) }}</div>
          </div>
        </div>
        <div class="flex max-w-full justify-end mx-10">
          <div class="flex gap-10 items-center w-fit text-[14px]">
            <input
              :value="'Sale Tax ' + (taxRate * 100).toFixed(0) + '%'"
              class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent focus:bg-amber-100 focus:text-black h-7 font-bold outline-none w-[120px]"
              @input="updateTaxRate"
            />
            <div>{{ calculatedSaleTax.toFixed(2) }}</div>
          </div>
        </div>
        <div class="flex max-w-full justify-end mx-10 mb-5 mt-2">
          <div class="flex gap-[92px] items-center w-fit text-[14px]">
            <h1>TOTAL</h1>
            <div>{{ calculatedTotal.toFixed(2) }}</div>
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
