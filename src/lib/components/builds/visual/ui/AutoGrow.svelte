<script lang="ts">
  // A borderless textarea that grows with its text, for editing headings and captions in place.
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  let { value = $bindable(''), singleLine = false, element = $bindable(), onenter, class: className = '', ...rest }:
    Omit<HTMLTextareaAttributes, 'value'> & {
      value?: string;
      /** Enter never inserts a line break and pasted line breaks become spaces. */
      singleLine?: boolean;
      element?: HTMLTextAreaElement;
      onenter?: () => void;
    } = $props();

  function resize() {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight + element.offsetHeight - element.clientHeight}px`;
  }
  $effect(() => { void value; resize(); });
  $effect(() => {
    if (!element) return;
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  });

  function input(event: Event & { currentTarget: HTMLTextAreaElement }) {
    const text = singleLine ? event.currentTarget.value.replace(/\s*[\r\n]+\s*/g, ' ') : event.currentTarget.value;
    if (text !== event.currentTarget.value) event.currentTarget.value = text;
    value = text;
  }
  function keydown(event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }) {
    if (singleLine && event.key === 'Enter') { event.preventDefault(); onenter?.(); }
    if (typeof rest.onkeydown === 'function') rest.onkeydown(event);
  }
</script>

<textarea {...rest} bind:this={element} class={`ve-bare ve-autogrow ${className}`} rows="1" {value} oninput={input} onkeydown={keydown}></textarea>
