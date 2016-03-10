/*
  phylogeny.js
  Copyright (c) 2016, Mark Zifchock

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer. Redistributions in binary
  form must reproduce the above copyright notice, this list of conditions and
  the following disclaimer in the documentation and/or other materials
  provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.

*/

var PhylogenyTree = function( el, config ) {

  if (!(this instanceof PhylogenyTree)) {
    return new PhylogenyTree( el, config );
  }

  var newick = Newick.parse( config.data );
  var newickNodes = [];

  function buildNewickNodes(node, callback) {
    newickNodes.push(node);
    if (node.branchset) {
      for (var i=0; i < node.branchset.length; i++) {
        buildNewickNodes(node.branchset[i]);
      }
    }
  }

  buildNewickNodes(newick);
/*
  d3.phylogram.buildRadial('#radialtree', newick, {
    width: 400,
    skipLabels: true
  })
*/
  d3.phylogram.build( el, newick, {
    width: config.dimension.x,
    height: config.dimension.y,
    skipTicks: true,
    skipBranchLengthScaling: true
  });

};
