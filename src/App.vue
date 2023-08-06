<script setup lang="ts">
import { ref } from 'vue'
const time0 = ref<Date | null>(new Date())

const oneMonthFromNow = new Date()
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)
const time1 = ref<Date | null>(oneMonthFromNow)
</script>

<template>
  <div class="flex items-center justify-center">
    <div></div>
    <div class="flex items-center flex-col w-[50%] gap-5 my-10">
      <h1 class="text-2xl text-center">
        Online Invoicing Software Tool - Create, Generate and Download Invoices or Invoice Templates
        as PDF
      </h1>
      <div class="flex flex-col bg-white w-[700px] h-[842px] shadow-xl">
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
        <div class="flex gap-2 justify-between m-10 mt-14">
          <div class="flex-1 flex flex-col">
            <div class="flex gap-1">
              <input
                value="Bill To:"
                class="hover:bg-amber-100 text-[14px] mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
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
            <div class="flex-1 flex-col gap-2">
              <input
                value="Invoice#"
                class="hover:bg-amber-100 text-[14px] w-fit mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Invoice Date"
                class="hover:bg-amber-100 text-[14px] mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                value="Due Date"
                class="hover:bg-amber-100 text-[14px] focus:bg-amber-100 font-bold h-8 outline-none"
              />
            </div>
            <div class="flex-2 flex-col gap-2">
              <input
                value="Invoice#"
                placeholder="INV-12"
                class="hover:bg-amber-100 text-[14px] mb-5 focus:bg-amber-100 h-8 font-bold outline-none"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] mb-5 focus:bg-amber-100 h-8 outline-none"
                v-model="time0"
              />
              <input
                type="date"
                class="hover:bg-amber-100 text-[14px] mb-5 focus:bg-amber-100 h-8 outline-none"
                v-model="time1"
              />
            </div>
          </div>
        </div>
        <div class="m-10">
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
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </th>
                <th class="py-2 px-4">
                  <input
                    value="Rate"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </th>
                <th class="py-2 px-4">
                  <input
                    value="Amount"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-100 divide-y divide-gray-300">
              <tr class="bg-white hover:bg-gray-200">
                <td class="py-2 px-4">
                  <textarea
                    class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100"
                    rows="4"
                  >
Invoice Item Description. E.g. Spare part for Project X
</textarea
                  >
                </td>
                <td class="py-2 px-4">
                  <input
                    value="2"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </td>
                <td class="py-2 px-4">
                  <input
                    value="100"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </td>
                <td class="py-2 px-4">200</td>
              </tr>
              <tr class="bg-white hover:bg-gray-200">
                <td class="py-2 px-4">
                  <textarea
                    class="text-black hover:bg-amber-100 text-[14px] focus:bg-amber-100"
                    rows="2"
                    placeholder="Enter item name/description
"
                  ></textarea>
                </td>
                <td class="py-2 px-4">
                  <input
                    value="2"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </td>
                <td class="py-2 px-4">
                  <input
                    value="100"
                    class="hover:bg-amber-100 rounded-sm hover:text-black bg-transparent text-[14px] focus:bg-amber-100 focus:text-black h-8 font-bold outline-none w-[100px]"
                  />
                </td>
                <td class="py-2 px-4">200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
