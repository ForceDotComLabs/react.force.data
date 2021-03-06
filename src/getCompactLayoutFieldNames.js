/*
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import trim from 'lodash.trim';
import {forceClient} from 'react.force';

module.exports = (opts) => {
  return new Promise(
    (resolve, reject) => {
      const fields = [];
      const compactTitleFieldNames = [];
      const refs = {};
      if(opts.compactLayout && opts.compactLayout.fieldItems){
        opts.compactLayout.fieldItems.forEach((fieldItem, fieldItemIndex)=>{
          if(fieldItem.layoutComponents && fieldItem.layoutComponents.length){
            fieldItem.layoutComponents.forEach((layoutComponent, index)=>{
              if(layoutComponent.components && layoutComponent.components.length){
                layoutComponent.components.forEach((component)=>{
                  if(component.value && trim(component.value,'_-\n\t').length){
                    fields.push(component.value);
                    if(fieldItemIndex < 1){
                      compactTitleFieldNames.push(component.value);
                    }
                  }
                });
              }
              else{
                if(layoutComponent.value && trim(layoutComponent.value,'_-\n\t').length){
                  fields.push(layoutComponent.value);
                  if(layoutComponent.details &&
                      layoutComponent.details.type &&
                      layoutComponent.details.type === 'reference' &&
                      layoutComponent.details.referenceTo &&
                      layoutComponent.details.referenceTo.length){
                        const ref = layoutComponent.details.referenceTo[layoutComponent.details.referenceTo.length-1];
                        refs[layoutComponent.details.name] = ref;
                  }

                  if(fieldItemIndex < 1){
                    compactTitleFieldNames.push(layoutComponent.value);
                  }
                }
              }
            });
          }
        });
        opts.compactLayoutFieldNames = fields;
        opts.compactTitleFieldNames = compactTitleFieldNames;
        opts.compactLayout.refs = refs;
        resolve(opts);
      }
      else{
        console.log('compactLayout object not found');
        resolve(opts);
      }
    }
  );
};
