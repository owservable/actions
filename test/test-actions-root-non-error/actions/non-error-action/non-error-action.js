
			class NonErrorAction {
				signature() {
					throw 'This is a string error, not an Error object';
				}
			}
			
			module.exports = { default: NonErrorAction };
		