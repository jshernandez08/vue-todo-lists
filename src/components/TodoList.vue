<template>
  <div class="box">
    <div class="columns">
        <div class="column">{{  today }}</div>
        <div class="column">{{ dayWeek  }}</div>
    </div>
    <b-field>
        <input
            type="text"
            class="input is-success"
            placeholder="Add new task"
            @keyup.enter="addTask" 
        />
    </b-field><br/>
    <div v-for="task in todoLists" :key="task._id">
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
    </div>
  </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'TodoList',
        data: function(){
            return {
                today: moment().format('MMMM Do YYYY'),
                dayWeek: moment().format('dddd'),
                todoLists: [{
                    _id: 1,
                    title: "My firts task",
                    completed: false,
                    editing: false
                }]
            }
        },
        methods: {
            addTask: function(e){
                var task = e.target.value;
                if (task.trim().length === 0){
                    return;
                }
                this.todoLists.push({
                    _id: this.lastId,
                    title: task,
                    completed: false,
                    editing: false
                });
                e.target.value = "";
            },
            editTask: function(task){
                task.editing = true;
                this.$nextTick(() => {
                    this.$refs["inputEditTask-" + task._id][0].focus();
                });
            },
            onEditTask: function(taskId, e){
                var task = e.target.value;
                if (task.trim().length === 0){
                    return;
                }
                this.todoLists = this.todoLists.map(function(todo){
                    if (todo._id === taskId){
                        todo.title = task;
                        todo.editing = false;
                        return todo;
                    }
                    return todo;
                });
            },
            cancelEdit: function(task){
                task.editing = false;
            },
            removeTask: function(taskId){
                this.todoLists = this.todoLists.filter((task) => {
                    return task._id !== taskId;
                });
            }
        },
        computed: {
            lastId: function(){
                if (!this.todoLists.length){
                    return 1;
                }
                return this.todoLists[this.todoLists.length - 1]._id + 1;
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
