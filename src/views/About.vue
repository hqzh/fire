<template>
	<div id="x6-container"></div>
</template>

<script>
	import { Graph } from '@antv/x6';
	export default {
		data() {
			return {
				data: {
					// 节点
					nodes: [
						{
							id: 'node1', // String，可选，节点的唯一标识
							x: 80, // Number，必选，节点位置的 x 值
							y: 90, // Number，必选，节点位置的 y 值
							shape: 'path',
							width: 80,
							height: 80,
							// https://www.svgrepo.com/svg/13653/like
							path:
								'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
							attrs: {
								body: {
									fill: '#D75A4A',
									stroke: 'none',
								},
							},
						},
						{
							id: 'node2', // String，节点的唯一标识
							x: 260, // Number，必选，节点位置的 x 值
							y: 280, // Number，必选，节点位置的 y 值
							shape: 'path',
							width: 80,
							height: 80,
							// https://www.svgrepo.com/svg/13695/star
							path:
								'M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z',
							attrs: {
								body: {
									fill: '#ED8A19',
									stroke: 'none',
								},
							},
						},
					],
					// 边
					edges: [],
				},
			};
		},
		mounted() {
			const width = document.getElementById('x6-container').scrollWidth;
			const height =
				document.getElementById('x6-container').scrollHeight || 600;
			console.log(height);
			const graph = new Graph({
				container: document.getElementById('x6-container'),
				width,
				height,
				background: {
					image: '/static/cad.jpg',
					position: 'center', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
					size: '100% 100%', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
					repeat: 'no-repeat', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
				},
			});
			graph.fromJSON(this.data);
		},
	};
</script>

<style lang="less" scope>
	#x6-container {
		height: 100%;
	}
</style>
