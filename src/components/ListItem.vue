<template>
    <div class="columns">
        <div class="column">
            <span
                v-if="!task.editing"
                :class="{ completed: task.completed }"
                @dblclick="editTask(task)"
            >
                {{ task.title }}
            </span>
            <input
                v-else
                type="text"
                class="input is-success"
                :value="task.title"
                :ref="'inputEditTask-' + task._id"
                @keyup.enter="onEditTask(task._id, $event)"
                @blur="onEditTask(task._id, $event)"
                @keyup.esc="cancelEdit(task)"
            />
        </div>
        <div class="column">
            <b-checkbox
                v-model="task.completed"
                type="is-success"
            >
            </b-checkbox>
            <b-button
                type="is-danger"
                size="is-small"
                @click="removeTask(task._id)"
            >
                X
            </b-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ListItem',
        props: {
            task: {
                type: Object,
                required: true
            }
        },
        data: function(){
            return {}
        },
        methods: {
            editTask: function(task){
                task.editing = true;
                this.$nextTick(() => {
                    this.$refs["inputEditTask-" + task._id].focus();
                });
            },
            onEditTask: function(taskId, e){
                let taskValue = e.target.value;
                if (taskValue.trim().length === 0){
                    return;
                }
                this.$emit("edit-task", {
                    _id: taskId,
                    value: taskValue
                });
            },
            removeTask: function(taskId){
                this.$emit("remove-task", taskId);
            },
            cancelEdit: function(task){
                task.editing = false;
            }
        }
    }
</script>

<style scoped>
    .completed {
        text-decoration: line-through;
        color: grey;
    }
</style>
