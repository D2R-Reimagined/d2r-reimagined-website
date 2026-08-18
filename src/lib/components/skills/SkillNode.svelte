<script lang="ts">
  import { i18n } from '$lib/i18n';
  import type { Skill } from '$lib/types';

  let {
    skill,
    rank,
    selected,
    available,
    select,
    increase,
    decrease
  }: {
    skill: Skill;
    rank: number;
    selected: boolean;
    available: boolean;
    select: (skill: Skill) => void;
    increase: (skill: Skill) => void;
    decrease: (skill: Skill) => void;
  } = $props();

  let name = $derived($i18n.t(skill.NameKey));
  let initial = $derived(name.trim().charAt(0).toUpperCase() || '?');

  function addPoint(): void {
    select(skill);
    increase(skill);
  }
</script>

<div class="skill-position" style={`--skill-row: ${skill.Row}; --skill-column: ${skill.Column};`}>
  <button
    type="button"
    class:allocated={rank > 0}
    class:selected
    class:available
    class="skill-node"
    aria-label={`${name}: ${rank} of ${skill.MaxLevel || 20} points`}
    aria-pressed={rank > 0}
    aria-disabled={!available && rank === 0}
    title={`${name} — left click to add, right click to remove`}
    onclick={addPoint}
    onfocus={() => select(skill)}
    onmouseenter={() => select(skill)}
    oncontextmenu={(event) => {
      event.preventDefault();
      select(skill);
      decrease(skill);
    }}
  >
    <span class="skill-initial" aria-hidden="true">{initial}</span>
    <span class="skill-rank">{rank}/{skill.MaxLevel || 20}</span>
  </button>
  <span class="skill-name">{name}</span>
</div>

<style>
  .skill-position {
    position: absolute;
    z-index: 2;
    left: calc((var(--skill-column) - 0.5) * 33.333333%);
    top: calc((var(--skill-row) - 0.5) * 16.666667%);
    width: 6rem;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .skill-node {
    position: relative;
    display: grid;
    width: 3.8rem;
    height: 3.8rem;
    margin: 0 auto;
    place-items: center;
    border: 2px solid #48433a;
    border-radius: 0.3rem;
    color: #777169;
    background:
      radial-gradient(circle at 40% 28%, rgb(255 255 255 / 0.09), transparent 35%),
      linear-gradient(145deg, #24211e, #080808 70%);
    box-shadow: inset 0 0 0 2px #080808, 0 3px 9px #000;
    transition: border-color 140ms ease, color 140ms ease, filter 140ms ease, transform 140ms ease;
  }

  .skill-node.available {
    border-color: #9d8652;
    color: #d8c9a7;
    filter: brightness(1.06);
  }

  .skill-node.allocated {
    border-color: #d2b56c;
    color: #fff2bc;
    background:
      radial-gradient(circle at 50% 42%, rgb(196 61 31 / 0.55), transparent 58%),
      linear-gradient(145deg, #402016, #0b0908 72%);
    box-shadow: inset 0 0 0 2px #180b07, 0 0 16px rgb(228 90 53 / 0.32);
  }

  .skill-node.selected {
    transform: translateY(-2px);
    outline: 2px solid rgb(247 241 227 / 0.72);
    outline-offset: 2px;
  }

  .skill-node:hover { filter: brightness(1.22); }
  .skill-initial { font-family: var(--font-display); font-size: 1.65rem; }

  .skill-rank {
    position: absolute;
    right: -0.75rem;
    bottom: -0.5rem;
    min-width: 2rem;
    border: 1px solid #78643a;
    border-radius: 999px;
    padding: 0.08rem 0.25rem;
    color: #f7f1e3;
    background: #080808;
    font-family: Arial, sans-serif;
    font-size: 0.64rem;
    line-height: 1rem;
  }

  .skill-name {
    display: block;
    margin-top: 0.45rem;
    color: #d8c9a7;
    font-size: 0.71rem;
    line-height: 0.85rem;
    text-shadow: 0 2px 3px #000;
  }
</style>
