"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore, LOADING_STATE } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideMenus() {
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const [value, setValue] = useState("");

  const addChat = useChatStore((state) => state.addChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const clearChat = useChatStore((state) => state.clearChat);
  const toggleChatActive = useChatStore((state) => state.toggleChatActive);
  const updateChatName = useChatStore((state) => state.updateChatName);

  return (
    <div className="left-0 top-0 bottom-0 w-[280px] fixed px-2.5 border-r bg-sideMenu">
      <div className="text-xl font-semibold tracking-tight h-20 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="800%" height="800%" viewBox="35 45 300 300" preserveAspectRatio="xMidYMid meet">
          <defs><g/><clipPath id="5e212e4afe"><path d="M 91.738281 187.5 L 105.5 187.5 L 105.5 194.574219 L 91.738281 194.574219 Z M 91.738281 187.5 " clip-rule="nonzero"/></clipPath><clipPath id="c7666398b5"><path d="M 93.238281 187.5 L 103.976562 187.5 C 104.375 187.5 104.753906 187.65625 105.035156 187.9375 C 105.316406 188.21875 105.476562 188.601562 105.476562 189 L 105.476562 193.074219 C 105.476562 193.472656 105.316406 193.851562 105.035156 194.132812 C 104.753906 194.414062 104.375 194.574219 103.976562 194.574219 L 93.238281 194.574219 C 92.839844 194.574219 92.460938 194.414062 92.179688 194.132812 C 91.898438 193.851562 91.738281 193.472656 91.738281 193.074219 L 91.738281 189 C 91.738281 188.601562 91.898438 188.21875 92.179688 187.9375 C 92.460938 187.65625 92.839844 187.5 93.238281 187.5 Z M 93.238281 187.5 " clip-rule="nonzero"/></clipPath><clipPath id="e5ae95d06c"><path d="M 267.855469 191.035156 L 278.375 191.035156 L 278.375 201.554688 L 267.855469 201.554688 Z M 267.855469 191.035156 " clip-rule="nonzero"/></clipPath><clipPath id="809d2fc49d"><path d="M 273.113281 191.035156 C 270.210938 191.035156 267.855469 193.390625 267.855469 196.296875 C 267.855469 199.203125 270.210938 201.554688 273.113281 201.554688 C 276.019531 201.554688 278.375 199.203125 278.375 196.296875 C 278.375 193.390625 276.019531 191.035156 273.113281 191.035156 Z M 273.113281 191.035156 " clip-rule="nonzero"/></clipPath></defs><g clip-path="url(#5e212e4afe)"><g clip-path="url(#c7666398b5)"><path fill="#000000" d="M 91.738281 187.5 L 105.472656 187.5 L 105.472656 194.574219 L 91.738281 194.574219 Z M 91.738281 187.5 " fill-opacity="1" fill-rule="nonzero"/></g></g><g clip-path="url(#e5ae95d06c)"><g clip-path="url(#809d2fc49d)"><path fill="#000000" d="M 267.855469 191.035156 L 278.375 191.035156 L 278.375 201.554688 L 267.855469 201.554688 Z M 267.855469 191.035156 " fill-opacity="1" fill-rule="nonzero"/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(110.336847, 200.524706)"><g><path d="M 16.265625 -21.53125 C 19.109375 -21.53125 21.300781 -20.597656 22.84375 -18.734375 C 24.382812 -16.867188 25.15625 -14.117188 25.15625 -10.484375 C 25.15625 -6.867188 24.382812 -4.132812 22.84375 -2.28125 C 21.300781 -0.4375 19.109375 0.484375 16.265625 0.484375 C 13.816406 0.484375 11.847656 -0.3125 10.359375 -1.90625 L 10.359375 7.859375 L 2.4375 7.859375 L 2.4375 -21.046875 L 8.890625 -21.046875 L 9.5625 -18.0625 C 11.101562 -20.375 13.335938 -21.53125 16.265625 -21.53125 Z M 13.796875 -15.671875 C 12.617188 -15.671875 11.738281 -15.253906 11.15625 -14.421875 C 10.570312 -13.597656 10.28125 -12.523438 10.28125 -11.203125 L 10.28125 -9.890625 C 10.28125 -8.554688 10.570312 -7.46875 11.15625 -6.625 C 11.738281 -5.789062 12.617188 -5.375 13.796875 -5.375 C 16.078125 -5.375 17.21875 -6.742188 17.21875 -9.484375 L 17.21875 -11.59375 C 17.21875 -14.3125 16.078125 -15.671875 13.796875 -15.671875 Z M 13.796875 -15.671875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(132.854346, 200.524706)"><g><path d="M 13.265625 -21.53125 C 16.960938 -21.53125 19.867188 -20.59375 21.984375 -18.71875 C 24.097656 -16.84375 25.15625 -14.109375 25.15625 -10.515625 C 25.15625 -6.929688 24.097656 -4.203125 21.984375 -2.328125 C 19.867188 -0.453125 16.960938 0.484375 13.265625 0.484375 C 9.578125 0.484375 6.679688 -0.445312 4.578125 -2.3125 C 2.484375 -4.175781 1.4375 -6.910156 1.4375 -10.515625 C 1.4375 -14.128906 2.484375 -16.867188 4.578125 -18.734375 C 6.679688 -20.597656 9.578125 -21.53125 13.265625 -21.53125 Z M 13.265625 -16.140625 C 10.660156 -16.140625 9.359375 -14.640625 9.359375 -11.640625 L 9.359375 -9.359375 C 9.359375 -6.390625 10.660156 -4.90625 13.265625 -4.90625 C 15.898438 -4.90625 17.21875 -6.390625 17.21875 -9.359375 L 17.21875 -11.640625 C 17.21875 -14.640625 15.898438 -16.140625 13.265625 -16.140625 Z M 13.265625 -16.140625 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(155.371844, 200.524706)"><g><path d="M 16.90625 -21.53125 C 19.34375 -21.53125 21.171875 -20.847656 22.390625 -19.484375 C 23.617188 -18.128906 24.234375 -16.175781 24.234375 -13.625 L 24.234375 0 L 16.296875 0 L 16.296875 -12.671875 C 16.296875 -13.578125 16.0625 -14.300781 15.59375 -14.84375 C 15.132812 -15.394531 14.476562 -15.671875 13.625 -15.671875 C 12.644531 -15.671875 11.847656 -15.347656 11.234375 -14.703125 C 10.628906 -14.066406 10.328125 -13.285156 10.328125 -12.359375 L 10.328125 0 L 2.390625 0 L 2.390625 -21.046875 L 8.890625 -21.046875 L 9.40625 -17.859375 C 10.226562 -18.972656 11.3125 -19.863281 12.65625 -20.53125 C 14 -21.195312 15.414062 -21.53125 16.90625 -21.53125 Z M 16.90625 -21.53125 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(177.889342, 200.524706)"><g><path d="M 17.703125 0 L 17.015625 -2.984375 C 15.472656 -0.671875 13.242188 0.484375 10.328125 0.484375 C 7.484375 0.484375 5.289062 -0.445312 3.75 -2.3125 C 2.207031 -4.175781 1.4375 -6.925781 1.4375 -10.5625 C 1.4375 -14.175781 2.207031 -16.90625 3.75 -18.75 C 5.289062 -20.601562 7.484375 -21.53125 10.328125 -21.53125 C 12.742188 -21.53125 14.707031 -20.71875 16.21875 -19.09375 L 16.21875 -28.890625 L 24.15625 -28.890625 L 24.15625 0 Z M 12.796875 -15.671875 C 10.503906 -15.671875 9.359375 -14.300781 9.359375 -11.5625 L 9.359375 -9.453125 C 9.359375 -6.734375 10.503906 -5.375 12.796875 -5.375 C 13.960938 -5.375 14.835938 -5.785156 15.421875 -6.609375 C 16.003906 -7.441406 16.296875 -8.519531 16.296875 -9.84375 L 16.296875 -11.15625 C 16.296875 -12.488281 16.003906 -13.570312 15.421875 -14.40625 C 14.835938 -15.25 13.960938 -15.671875 12.796875 -15.671875 Z M 12.796875 -15.671875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(200.406841, 200.524706)"><g><path d="M 13.265625 -21.53125 C 17.117188 -21.53125 20.0625 -20.625 22.09375 -18.8125 C 24.132812 -17.007812 25.15625 -14.242188 25.15625 -10.515625 L 25.15625 -9.171875 L 9.359375 -9.171875 C 9.359375 -7.648438 9.695312 -6.503906 10.375 -5.734375 C 11.0625 -4.960938 12.132812 -4.578125 13.59375 -4.578125 C 14.914062 -4.578125 15.890625 -4.859375 16.515625 -5.421875 C 17.140625 -5.984375 17.453125 -6.726562 17.453125 -7.65625 L 25.15625 -7.65625 C 25.15625 -5.101562 24.179688 -3.109375 22.234375 -1.671875 C 20.296875 -0.234375 17.46875 0.484375 13.75 0.484375 C 9.84375 0.484375 6.8125 -0.425781 4.65625 -2.25 C 2.507812 -4.070312 1.4375 -6.828125 1.4375 -10.515625 C 1.4375 -14.128906 2.484375 -16.867188 4.578125 -18.734375 C 6.679688 -20.597656 9.578125 -21.53125 13.265625 -21.53125 Z M 13.59375 -16.46875 C 11.09375 -16.46875 9.695312 -15.285156 9.40625 -12.921875 L 17.140625 -12.921875 C 17.140625 -14.003906 16.828125 -14.863281 16.203125 -15.5 C 15.578125 -16.144531 14.707031 -16.46875 13.59375 -16.46875 Z M 13.59375 -16.46875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(222.924339, 200.524706)"><g><path d="M 15.1875 -21.5625 C 15.800781 -21.5625 16.34375 -21.488281 16.8125 -21.34375 C 17.289062 -21.195312 17.53125 -21.109375 17.53125 -21.078125 L 17.53125 -14.421875 L 14.984375 -14.421875 C 13.335938 -14.421875 12.148438 -13.992188 11.421875 -13.140625 C 10.691406 -12.296875 10.328125 -11.035156 10.328125 -9.359375 L 10.328125 0 L 2.390625 0 L 2.390625 -21.046875 L 8.890625 -21.046875 L 9.40625 -17.859375 C 9.882812 -19.078125 10.640625 -20 11.671875 -20.625 C 12.710938 -21.25 13.882812 -21.5625 15.1875 -21.5625 Z M 15.1875 -21.5625 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(236.554122, 200.524706)"><g><path d="M 12.796875 -21.53125 C 16.015625 -21.53125 18.628906 -20.988281 20.640625 -19.90625 C 22.660156 -18.832031 23.671875 -17.085938 23.671875 -14.671875 L 23.671875 -6.453125 C 23.671875 -6.003906 23.773438 -5.632812 23.984375 -5.34375 C 24.203125 -5.050781 24.523438 -4.90625 24.953125 -4.90625 L 26.390625 -4.90625 L 26.390625 -0.3125 C 26.304688 -0.257812 26.097656 -0.171875 25.765625 -0.046875 C 25.429688 0.0664062 24.957031 0.179688 24.34375 0.296875 C 23.738281 0.421875 23.035156 0.484375 22.234375 0.484375 C 20.691406 0.484375 19.421875 0.25 18.421875 -0.21875 C 17.429688 -0.6875 16.75 -1.332031 16.375 -2.15625 C 15.375 -1.351562 14.25 -0.710938 13 -0.234375 C 11.75 0.242188 10.285156 0.484375 8.609375 0.484375 C 3.671875 0.484375 1.203125 -1.484375 1.203125 -5.421875 C 1.203125 -7.460938 1.75 -9.019531 2.84375 -10.09375 C 3.945312 -11.175781 5.535156 -11.914062 7.609375 -12.3125 C 9.679688 -12.71875 12.394531 -12.921875 15.75 -12.921875 L 15.75 -13.953125 C 15.75 -14.773438 15.460938 -15.398438 14.890625 -15.828125 C 14.316406 -16.253906 13.578125 -16.46875 12.671875 -16.46875 C 11.847656 -16.46875 11.132812 -16.316406 10.53125 -16.015625 C 9.9375 -15.722656 9.640625 -15.257812 9.640625 -14.625 L 9.640625 -14.46875 L 1.828125 -14.46875 C 1.804688 -14.601562 1.796875 -14.789062 1.796875 -15.03125 C 1.796875 -17.019531 2.742188 -18.597656 4.640625 -19.765625 C 6.546875 -20.941406 9.265625 -21.53125 12.796875 -21.53125 Z M 15.75 -9.171875 C 13.488281 -9.171875 11.816406 -8.921875 10.734375 -8.421875 C 9.660156 -7.929688 9.125 -7.273438 9.125 -6.453125 C 9.125 -5.128906 10.03125 -4.46875 11.84375 -4.46875 C 12.875 -4.46875 13.78125 -4.742188 14.5625 -5.296875 C 15.351562 -5.859375 15.75 -6.550781 15.75 -7.375 Z M 15.75 -9.171875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(139.833466, 221.373309)"><g><path d="M 6.390625 -8.25 C 6.804688 -8.25 7.1875 -8.160156 7.53125 -7.984375 C 7.875 -7.816406 8.144531 -7.578125 8.34375 -7.265625 C 8.550781 -6.953125 8.65625 -6.609375 8.65625 -6.234375 C 8.65625 -5.210938 8.195312 -4.570312 7.28125 -4.3125 L 7.28125 -4.265625 C 8.332031 -4.023438 8.859375 -3.335938 8.859375 -2.203125 C 8.859375 -1.765625 8.75 -1.378906 8.53125 -1.046875 C 8.320312 -0.710938 8.03125 -0.453125 7.65625 -0.265625 C 7.289062 -0.0859375 6.890625 0 6.453125 0 L 0.890625 0 L 0.890625 -8.25 Z M 3.546875 -5.046875 L 5.359375 -5.046875 C 5.535156 -5.046875 5.679688 -5.101562 5.796875 -5.21875 C 5.910156 -5.34375 5.96875 -5.5 5.96875 -5.6875 L 5.96875 -5.8125 C 5.96875 -5.988281 5.90625 -6.132812 5.78125 -6.25 C 5.664062 -6.375 5.523438 -6.4375 5.359375 -6.4375 L 3.546875 -6.4375 Z M 3.546875 -1.921875 L 5.5625 -1.921875 C 5.726562 -1.921875 5.867188 -1.984375 5.984375 -2.109375 C 6.109375 -2.234375 6.171875 -2.382812 6.171875 -2.5625 L 6.171875 -2.6875 C 6.171875 -2.875 6.109375 -3.03125 5.984375 -3.15625 C 5.867188 -3.28125 5.726562 -3.34375 5.5625 -3.34375 L 3.546875 -3.34375 Z M 3.546875 -1.921875 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(147.789487, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(150.4055, 221.373309)"><g><path d="M 6.015625 0 L 3.359375 0 L 3.359375 -3.203125 L 0.078125 -8.25 L 3.125 -8.25 L 4.71875 -5.515625 L 4.765625 -5.515625 L 6.34375 -8.25 L 9.234375 -8.25 L 6.015625 -3.203125 Z M 6.015625 0 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(158.372527, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(160.988541, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(163.604554, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(166.224089, 221.373309)"><g><path d="M 6.453125 0 L 6.453125 -3.125 L 3.546875 -3.125 L 3.546875 0 L 0.890625 0 L 0.890625 -8.25 L 3.546875 -8.25 L 3.546875 -5.25 L 6.453125 -5.25 L 6.453125 -8.25 L 9.109375 -8.25 L 9.109375 0 Z M 6.453125 0 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(174.840114, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(177.456127, 221.373309)"><g><path d="M 0.890625 -8.25 L 8.03125 -8.25 L 8.03125 -6.28125 L 3.546875 -6.28125 L 3.546875 -5.140625 L 7.375 -5.140625 L 7.375 -3.234375 L 3.546875 -3.234375 L 3.546875 -1.984375 L 8.109375 -1.984375 L 8.109375 0 L 0.890625 0 Z M 0.890625 -8.25 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(184.74014, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(187.356153, 221.373309)"><g><path d="M 9.109375 -3.328125 C 9.109375 -2.191406 8.75 -1.328125 8.03125 -0.734375 C 7.320312 -0.148438 6.3125 0.140625 5 0.140625 C 3.6875 0.140625 2.671875 -0.148438 1.953125 -0.734375 C 1.242188 -1.328125 0.890625 -2.191406 0.890625 -3.328125 L 0.890625 -8.25 L 3.546875 -8.25 L 3.546875 -3.359375 C 3.546875 -2.890625 3.664062 -2.519531 3.90625 -2.25 C 4.15625 -1.976562 4.515625 -1.84375 4.984375 -1.84375 C 5.460938 -1.84375 5.828125 -1.976562 6.078125 -2.25 C 6.328125 -2.53125 6.453125 -2.898438 6.453125 -3.359375 L 6.453125 -8.25 L 9.109375 -8.25 Z M 9.109375 -3.328125 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(195.972177, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(198.588191, 221.373309)"><g><path d="M 8.71875 -5.71875 C 8.71875 -5.21875 8.582031 -4.765625 8.3125 -4.359375 C 8.039062 -3.953125 7.644531 -3.648438 7.125 -3.453125 L 8.96875 0 L 5.984375 0 L 4.53125 -3.015625 L 3.546875 -3.015625 L 3.546875 0 L 0.890625 0 L 0.890625 -8.25 L 5.9375 -8.25 C 6.53125 -8.25 7.035156 -8.132812 7.453125 -7.90625 C 7.878906 -7.6875 8.195312 -7.378906 8.40625 -6.984375 C 8.613281 -6.597656 8.71875 -6.175781 8.71875 -5.71875 Z M 6.03125 -5.609375 C 6.03125 -5.828125 5.957031 -6.007812 5.8125 -6.15625 C 5.664062 -6.300781 5.488281 -6.375 5.28125 -6.375 L 3.546875 -6.375 L 3.546875 -4.84375 L 5.28125 -4.84375 C 5.488281 -4.84375 5.664062 -4.914062 5.8125 -5.0625 C 5.957031 -5.21875 6.03125 -5.398438 6.03125 -5.609375 Z M 6.03125 -5.609375 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(206.544211, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(209.160225, 221.373309)"><g><path d="M 1.015625 0 L 1.015625 -8.25 L 3.65625 -8.25 L 3.65625 0 Z M 1.015625 0 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(212.448235, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(215.064248, 221.373309)"><g><path d="M 4.359375 -8.40625 C 5.410156 -8.40625 6.273438 -8.1875 6.953125 -7.75 C 7.640625 -7.320312 7.988281 -6.691406 8 -5.859375 L 8 -5.71875 L 5.515625 -5.71875 L 5.515625 -5.765625 C 5.515625 -6.003906 5.425781 -6.203125 5.25 -6.359375 C 5.070312 -6.515625 4.804688 -6.59375 4.453125 -6.59375 C 4.097656 -6.59375 3.828125 -6.539062 3.640625 -6.4375 C 3.453125 -6.332031 3.359375 -6.207031 3.359375 -6.0625 C 3.359375 -5.84375 3.484375 -5.679688 3.734375 -5.578125 C 3.992188 -5.472656 4.410156 -5.363281 4.984375 -5.25 C 5.640625 -5.113281 6.179688 -4.972656 6.609375 -4.828125 C 7.046875 -4.679688 7.421875 -4.4375 7.734375 -4.09375 C 8.054688 -3.757812 8.222656 -3.304688 8.234375 -2.734375 C 8.234375 -1.753906 7.898438 -1.03125 7.234375 -0.5625 C 6.578125 -0.09375 5.695312 0.140625 4.59375 0.140625 C 3.300781 0.140625 2.296875 -0.0703125 1.578125 -0.5 C 0.867188 -0.9375 0.515625 -1.703125 0.515625 -2.796875 L 3.03125 -2.796875 C 3.03125 -2.378906 3.132812 -2.097656 3.34375 -1.953125 C 3.5625 -1.816406 3.898438 -1.75 4.359375 -1.75 C 4.691406 -1.75 4.96875 -1.785156 5.1875 -1.859375 C 5.40625 -1.929688 5.515625 -2.078125 5.515625 -2.296875 C 5.515625 -2.503906 5.390625 -2.65625 5.140625 -2.75 C 4.898438 -2.851562 4.503906 -2.960938 3.953125 -3.078125 C 3.285156 -3.210938 2.726562 -3.359375 2.28125 -3.515625 C 1.84375 -3.671875 1.457031 -3.929688 1.125 -4.296875 C 0.800781 -4.660156 0.640625 -5.148438 0.640625 -5.765625 C 0.640625 -6.660156 0.988281 -7.320312 1.6875 -7.75 C 2.394531 -8.1875 3.285156 -8.40625 4.359375 -8.40625 Z M 4.359375 -8.40625 "/></g></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(222.348258, 221.373309)"><g/></g></g><g fill="#000000" fill-opacity="1"><g transform="translate(224.964274, 221.373309)"><g><path d="M 5.640625 -6.140625 L 5.640625 0 L 2.984375 0 L 2.984375 -6.140625 L 0.28125 -6.140625 L 0.28125 -8.25 L 8.34375 -8.25 L 8.34375 -6.140625 Z M 5.640625 -6.140625 "/></g></g></g>
        </svg>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="mb-2 flex-1 gap-2.5"
          onClick={() => {
            addChat();
          }}
        >
          <span className="i-mingcute-chat-2-fill w-4 h-4" />
          New Chat
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="hover:bg-[#c8c9ca]">
              <span className="i-f7-trash w-[18px] h-[18px]" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear the chat?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={clearChat}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-col gap-1">
        {list.map((item) => (
          <div
            className={cn(
              "flex items-center gap-2",
              "group h-9 text-[#4b4c4c] rounded-md pl-3 text-sm font-medium cursor-pointer transition-colors select-none hover:bg-sideMenuItem relative",
              "pr-3 hover:pr-14",
              {
                "bg-sideMenuItem": item.chat_id === activeId,
              }
            )}
            key={item.chat_id}
            onClick={() => {
              toggleChatActive(item.chat_id);
            }}
          >
            <span
              className={cn(
                "text-base flex-shrink-0",
                item.chat_state !== LOADING_STATE.NONE
                  ? "i-mingcute-loading-line animate-spin"
                  : "i-mingcute-message-3-line"
              )}
            />
            <div className="truncate">{item.chat_name || "Untitled"}</div>
            <div className="absolute right-3 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <span
                      className="i-ri-edit-line text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue(item.chat_name);
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent
                    className="w-[700px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Chat Title</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      className="h-36 resize-none"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <DialogFooter>
                      <div className="flex-1 flex justify-between">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              updateChatName(item.chat_id, value);
                            }}
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span
                      className="i-f7-trash text-base"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the chat?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteChat(item.chat_id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
