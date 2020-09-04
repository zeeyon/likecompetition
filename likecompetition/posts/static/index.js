var scrap = {
	delimiters: ['[[', ']]'],
	template: '<a class="scrap" v-bind:class="{ scrapped: this.isScrapped }" href="#" onclick="return false" v-on:click="toggle_scrap()"></a>',
	props: {
		url: String,
		initialScrapped: Boolean
	},
	data: function() {
		return {
			isScrapped: this.initialScrapped
		}
	},
	methods: {
		toggle_scrap: function() {
			var vue = this;
			var method = this.isScrapped ? 'delete' : 'post';
			axios({
				method: method,
				url: this.url
			})
			.then(function(response) {
				vue.isScrapped = !vue.isScrapped;
			})
			.catch(function(error) {
				console.log(error);
			})
		}
	}
};

var post_list = {
	components: {
		'scrap': scrap
	},
	data() {
		return {
			template: '',
			templateRender: null
		};
	},
	render(h) {
		if (!this.templateRender) {
			return h('div', 'loading...');
		} else {
			return this.templateRender();
		}
	},
	watch: {
		template: {
			immediate: true,
			handler() {
				console.log(this.template);
				var res = Vue.compile(this.template);
				this.templateRender = res.render;
				this.$options.staticRenderFns = [];
				this._staticTrees = [];
				for (var i in res.staticRenderFns) {
					this.$options.staticRenderFns.push(res.staticRenderFns[i]);
				}
			}
		}
	}
};

new Vue({
	delimiters: ['[[', ']]'],
	el: '#index',
	components: {
		'post_list': post_list
	},
	data: {
		filters: [
			{name_kor:'나이', name_eng:'age', options:[
				{name:'age10', text:'10대'},
				{name:'age20', text:'20대'},
				{name:'age30', text:'30대'}
			]},
			{name_kor:'성별', name_eng:'gender', options:[
				{name:'male', text:'남성'},
				{name:'female', text:'여성'}
			]},
			{name_kor:'지역', name_eng:'area', options:[
				{name:'seoul', text:'서울'},
				{name:'busan', text:'부산'},
				{name:'daegu', text:'대구'},
				{name:'incheon', text:'인천'},
				{name:'gwangju', text:'광주'},
				{name:'daejeon', text:'대전'},
				{name:'ulsan', text:'울산'},
				{name:'sejong', text:'세종'},
				{name:'gyeonggi', text:'경기'},
				{name:'gangwon', text:'강원'},
				{name:'chungbuk', text:'충북'},
				{name:'chungnam', text:'충남'},
				{name:'jeonbuk', text:'전북'},
				{name:'jeonnam', text:'전남'},
				{name:'gyeongbuk', text:'경북'},
				{name:'gyenognam', text:'경남'},
				{name:'jeju', text:'제주'}
			]},
			{name_kor:'분야', name_eng:'field', options:[
				{name:'web', text:'웹'},
				{name:'android', text:'안드로이드'},
				{name:'ios', text:'iOS'},
				{name:'game', text:'게임'},
				{name:'ml', text:'머신러닝'},
				{name:'bigdata', text:'빅데이터'},
				{name:'iot', text:'IoT'},
				{name:'blockchain', text:'블록체인'},
				{name:'vr', text:'가상현실'},
				{name:'etc', text:'기타'}
			]}
		],
		check_list: [],
		query: ['?page=1'],
		page: 1
	},
	methods: {
		remove_option: function(option) {
			this.check_list.splice(this.check_list.indexOf(option), 1);
		},
		next_page: function() {
			this.page++;
			this.send_query();
		},
		prev_page: function() {
			this.page = Math.max(this.page - 1, 1);
			this.send_query();
		},
		send_query: function() {
			var vue = this;
			this.query[0] = '/posts/?page=' + this.page;
			var query_string = this.query.join('&');
			axios.get(query_string)
			.then(function(response) {
				vue.$refs.post_list.template = response.data;
			})
			.catch(function(error) {
				console.log(error);
			})
		}
	},
	watch: {
		check_list: function() {
			this.query.splice(1, this.query.length - 1);
			for (var i = 0; i < this.filters.length; i++) {
				for (var j = 0; j < this.filters[i].options.length; j++) {
					if (this.check_list.includes(this.filters[i].options[j])) {
						this.query.push(this.filters[i].name_eng + '=' + this.filters[i].options[j].name);
					}
				}
			}
			this.page = 1;
			this.send_query();
		},
	},
	mounted: function() {
		this.send_query();
	}
});
