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
    <div v-for="task in todoListsFiltered" :key="task._id">
        <ListItem 
            :task="task"
            @edit-task="onEditTask"
            @remove-task="onRemoveTask"
        >
        </ListItem>
    </div>
    <hr/>
    <div v-show="filterBy === 'all'">
        <div class="columns">
            <div class="column">
                <p style="font-size: 18px;">
                    <b-checkbox
                        type="is-success"
                        v-model="checkedAllTasksCompleted"
                        @input="markAllTasksCompleted"
                    >
                        Mark all completed / <i>{{ totalTasksToDo }} tasks to do</i>
                    </b-checkbox>
                </p>
            </div>
            <div class="column">
                <b-button
                    type="is-info is-light"
                    v-if="hasTasksCompleted"
                    @click="clearAllTasksCompleted"
                    style="margin-top: -10px;"
                >
                    Clear all completed
                </b-button>
            </div>
        </div>
        <hr/>
    </div>
    <p style="font-size: 18px;">
        Filter by
    </p>
    <div class="buttons has-addons">
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'all'}"
            @click="onFilterBy('all')"
        >
            All
        </button>
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'completed'}"
            @click="onFilterBy('completed')"
        >
            Completed
        </button>
        <button
            class="button"
            :class="{'is-success is-light': filterBy === 'not_completed'}"
            @click="onFilterBy('not_completed')"
        >
            Not completed
        </button>
    </div>
  </div>
</template>

<script>
    import ListItem from './ListItem';
    import moment from 'moment';

    export default {
        name: 'TodoList',
        components: {
            ListItem
        },
        data: function(){
            return {
                today: moment().format('MMMM Do YYYY'),
                dayWeek: moment().format('dddd'),
                checkedAllTasksCompleted: false,
                filterBy: "all",
                todoLists: [{
                    _id: 1,
                    title: "My firts task",
                    completed: false,
                    editing: false
                }]
            }
        },
        watch: {
            todoLists: {
                deep: true,
                handler: function(newValue){
                    if (!newValue.length){
                        this.checkedAllTasksCompleted = false;
                        return;
                    }
                    this.checkedAllTasksCompleted = this.totalTasksToDo === 0;
                }
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
            onEditTask: function(taskData){
                this.todoLists = this.todoLists.map(function(todo){
                    if (todo._id === taskData._id){
                        todo.title = taskData.value;
                        todo.editing = false;
                        return todo;
                    }
                    return todo;
                });
            },
            onRemoveTask: function(taskId){
                this.todoLists = this.todoLists.filter((task) => {
                    return task._id !== taskId;
                });
            },
            markAllTasksCompleted: function(checked){
                this.todoLists.forEach((task) => {
                    task.completed = checked;
                });
            },
            clearAllTasksCompleted: function(){
                this.todoLists = this.todoLists.filter((task) => {
                    return !task.completed;
                });
            },
            onFilterBy: function(filter){
                this.filterBy = filter;
            }
        },
        computed: {
            lastId: function(){
                if (!this.todoLists.length){
                    return 1;
                }
                return this.todoLists[this.todoLists.length - 1]._id + 1;
            },
            totalTasksToDo: function(){
                if (!this.todoLists.length){
                    return 0;
                }
                return this.todoLists.filter((task) => {
                    return !task.completed;
                }).length;
            },
            totalTasksCompleted: function(){
                if (!this.todoLists.length){
                    return 0;
                }
                return this.todoLists.filter((task) => {
                    return task.completed;
                }).length;
            },
            hasTasksCompleted: function(){
                return this.totalTasksCompleted > 0;
            },
            todoListsFiltered: function(){
                if (this.filterBy === "all"){
                    return this.todoLists;
                }
                if (this.filterBy === "completed"){
                    return this.todoLists.filter((task) => {
                        return task.completed;
                    });
                }
                if (this.filterBy === "not_completed"){
                    return this.todoLists.filter((task) => {
                        return !task.completed;
                    });
                }
            }
        }
    }
</script>

<style scoped>
</style>
