<script setup>
    import { avatar } from "../stores/avatar";
    import { fade, scale, slide } from "svelte/transition";

    let actualPicture = "";

    avatar.subscribe((n) => {
        actualPicture = n;
    });
</script>

<div class="avatar">
    <!-- {query.avatar === 'true' ? '' : 'none'} -->
    <!-- {#if tchat.length} -->
    <img
        in:scale={{ duration: 400 }}
        out:scale={{ delay: 500, duration: 1000 }}
        src={actualPicture}
        alt=" "
    />
    <!-- {/if} -->
</div>

<style scope>
    .avatar {
        place-self: flex-end;
        grid-area: avatar;
    }

    .avatar img {
        width: 10em;
    }
</style>
