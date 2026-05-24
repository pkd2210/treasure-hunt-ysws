<script>
    import { Card } from "$lib/shad/components/ui/card/index.ts";
    import { Button } from "$lib/shad/components/ui/button/index.ts";
    let { projectName, slackId } = $props();
</script>
<Card class="w-full">
    <div class="flex flex-col items-start gap-2">
        <h3 class="text-lg font-semibold">{projectName}</h3>
        <p class="text-sm text-muted-foreground">Submitted by {slackId}</p>
    </div>
    <Button variant="outline" class="ml-auto">Review</Button>
</Card>