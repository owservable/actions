
			class ConstructorErrorAction {
				constructor() {
					throw new Error('Constructor failed');
				}
				
				signature() {
					return 'constructor-error-command';
				}
			}
			
			module.exports = { default: ConstructorErrorAction };
		